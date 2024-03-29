import { defineConfig } from 'vite';
import tsconfigPaths from "vite-tsconfig-paths"
import vue from '@vitejs/plugin-vue';

const caddyHead = `
{{$nonce := randAlphaNum 32}}
<!-- For now 'nonce-%[1]v' is not in use - because nonces and Vite, at least at the moment, are not friendly. -->
{{.RespHeader.Set "Content-Security-Policy" (printf "default-src 'self'; script-src 'report-sample' 'unsafe-inline' 'self' https://cdn.tiny.cloud https://plurali.icu/api; script-src-attr 'none'; style-src 'report-sample' 'unsafe-inline' 'self' https://cdn.tiny.cloud https://plurali.icu/api; base-uri 'self'; connect-src 'self'; font-src 'self'; frame-src 'self'; img-src 'self' https://plurali.icu/api blob: data: https://cdn.plurali.icu https://sp.tinymce.com https://cdn.tiny.cloud; manifest-src 'self'; media-src 'self';" $nonce)}}
{{.RespHeader.Set "X-Nonce" $nonce}}
`;

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    vue(),  
    // csp is a mess atm, let's disable it for now
    // {
    //   name: '@plurali/frontend-csp',
    //   transformIndexHtml: (html, context) => (context.server ? html : `${caddyHead}\n${html}`),
    // },
  ],
});
