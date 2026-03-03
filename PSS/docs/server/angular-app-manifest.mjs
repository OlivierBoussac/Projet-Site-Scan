
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/PSS/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "node_modules/@angular/animations/fesm2022/browser.mjs": [
    "chunk-PW25IW4Z.js"
  ]
},
  assets: {
    'index.csr.html': {size: 69402, hash: '7f1c03bf376f74a384b942892c7cb2cd57207e6a3eed68750ec2cdc5175c080a', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17186, hash: 'bdae44b27390d48bae83483ae5bc69065eca77098e45a1b2f42c8df5ef80bf2b', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-6N7GISYJ.css': {size: 101134, hash: 'WkPXiHPAX7A', text: () => import('./assets-chunks/styles-6N7GISYJ_css.mjs').then(m => m.default)}
  },
};
