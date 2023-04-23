import { Plugin, defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import crypto from 'crypto';
import cheerio from 'cheerio';
import fetch from 'node-fetch';

function csp(): Plugin {
  const HEAD = [
    `{{$nonce := randAlphaNum 32}}`,
    `{{.RespHeader.Set "Content-Security-Policy" (printf "default-src 'self'; script-src 'report-sample' 'self' https://cdn.tiny.cloud 'nonce-%[1]v'; style-src 'report-sample' 'nonce-%[1]v' 'self' https://cdn.tiny.cloud; base-uri 'self'; connect-src 'self'; font-src 'self'; frame-src 'self'; img-src 'self' blob: data: https://cdn.plurali.icu https://sp.tinymce.com https://cdn.tiny.cloud 'nonce-%[1]v'; manifest-src 'self'; media-src 'self';" $nonce)}}`,
    `{{.RespHeader.Set "X-Nonce" $nonce}}`,
  ].join("\n");

  return {
    name: '@plurali/frontend-csp',
    enforce: 'post',
    apply: 'build',
    transformIndexHtml: async (html, context) => {
      const $ = cheerio.load(html);

      const transform = async (element: cheerio.TagElement) => {
        let attr = element.type === 'script' ? 'src' : 'href';
        const src = element.attribs[attr];
        let data = src.startsWith('http') ? await (await fetch(src)).text() : null;

        if (!data) {
          const item = context.bundle[element.attribs[attr].slice(1)] as any;
          data = item?.code || item.source;
        }

        const hash = crypto.createHash('sha384').update(data).digest('base64');

        element.attribs.nonce = '{{$nonce}}';
        element.attribs.integrity = `sha384-${hash}`;
      };

      for (const script of $('script[src]').toArray() as cheerio.TagElement[]) {
        await transform(script);
      }

      for (const stylesheet of $('link[rel=stylesheet][href]').toArray() as cheerio.TagElement[]) {
        await transform(stylesheet);
      }

      return `${HEAD}${$.html()}`;
    },
  };
}

export default defineConfig({
  plugins: [vue(), csp()],
});
