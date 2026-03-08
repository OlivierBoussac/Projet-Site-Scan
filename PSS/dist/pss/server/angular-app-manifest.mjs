
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
    'index.csr.html': {size: 69398, hash: '5f6c2d91fa51a7501ee1a8eda408e664ee0e45299011574651f926d633cb783b', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17182, hash: 'ad38f1e000c0be843a106226f8a252541077ffe7bd0fe1fdef696db8261a3d3c', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-6N7GISYJ.css': {size: 101134, hash: 'WkPXiHPAX7A', text: () => import('./assets-chunks/styles-6N7GISYJ_css.mjs').then(m => m.default)}
  },
};
