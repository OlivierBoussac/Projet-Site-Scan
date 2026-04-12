
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "node_modules/@angular/animations/fesm2022/browser.mjs": [
    "chunk-OT7QCVRS.js"
  ]
},
  assets: {
    'index.csr.html': {size: 70087, hash: '7ace522d979c0d831da558546810d2b49bfac3b91d139014563bb555779bfa23', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17182, hash: 'df57de57b7d58f4fa770adbdb933b485620d7abd4733c84d610ee8c9e5f30c74', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-AQPJPOLY.css': {size: 103050, hash: 'IvHtzhy+Lvo', text: () => import('./assets-chunks/styles-AQPJPOLY_css.mjs').then(m => m.default)}
  },
};
