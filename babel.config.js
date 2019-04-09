module.exports = {
  presets: [
    ['@vue/app', {
      polyfills: [
        'es6.promise',
        'es6.symbol'
      ]
    }]
  ]
}

// module.exports = {
//   presets: ["@vue/app",
//     ["env", {
//       "modules": false,
//       "useBuiltIns": true,
//       "targets": {
//         "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
//       }
//     }]
//     // "stage-2"
//   ],
//   "plugins": ["transform-vue-jsx", "transform-runtime"],
//   "env": {
//     "development":{
//       "plugins": ["dynamic-import-node"]
//     }
//   }
// }

