import { FastifyHelmetOptions } from '@fastify/helmet';

export const csp: FastifyHelmetOptions['contentSecurityPolicy'] = {
  directives: {
    defaultSrc: ['self'],
    scriptSrc: [
      'report-sample',
      'unsafe-inline',
      'self',
      'https://cdn.tiny.cloud',
      'script-src-attr',
      'none',
      'http://plurali.icu/api',
    ],
    styleSrc: [
      'report-sample',
      'unsafe-inline',
      'self',
      'https://cdn.tiny.cloud',
      'fonts.googleapis.com',
      'http://plurali.icu/api',
    ],
    baseUri: ['self'],
    connectSrc: ['self'],
    fontSrc: ['self', 'https://fonts.google.com', 'fonts.gstatic.com'],
    frameSrc: ['self'],
    imgSrc: [
      'self',
      'blob:',
      'data:',
      'https://cdn.plurali.icu',
      'https://sp.tinymce.com',
      'https://cdn.tiny.cloud',
      'http://plurali.icu/api',
    ],
    manifestSrc: ['self'],
    mediaSrc: ['self'],
  },
};
