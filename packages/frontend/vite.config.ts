import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// import crypto from 'crypto';
// import cheerio from 'cheerio';
// import fetch from 'node-fetch';

// function csp(): Plugin {
//   const HEAD = [
//   ].join("\n");

//   return {
//     name: '@plurali/frontend-csp',
//     enforce: 'post',
//     apply: 'build',
//     transformIndexHtml: async (html, context) => {
//       return `${HEAD}${$.html()}`;
//     },
//   };
// }

export default defineConfig({
  plugins: [vue()],
  build: {
    noncePlaceholder: '{{$nonce}}'
  }
});
