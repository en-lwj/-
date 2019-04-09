'use strict'
const path = require('path')

const resolve = (dir) => {
  return path.resolve(__dirname, dir)
}

module.exports = {
  // 基本路径
  publicPath: ((mode) => {
    switch(mode) {
      case 'development': return '/'
      case 'production': return './'
      case 'sit': return '/haha/'
      default: return '/'
    }
  })(process.env.NODE_ENV),
  // 输出文件目录
  outputDir: 'dist',
  // 用于嵌套生成的静态资产（js，css，img，fonts）的目录。
  assetsDir: 'static',
  // 以多页模式构建应用程序。
  pages: undefined,
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  // 是否使用包含运行时编译器的Vue核心的构建。
  runtimeCompiler: false,
  // 默认情况下babel-loader忽略其中的所有文件node_modules。
  transpileDependencies: [],
  // 生产环境sourceMap
  productionSourceMap: true,
  // webpack配置
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      config.mode = 'production'
    } else {
      // 为开发环境修改配置...
      config.mode = 'development'
    }

  },
  chainWebpack: (config) => {
    // config.resolve.alias.set('@', path.resolve(__dirname, './src'))
    // svg图标配置
    config.module.rules.delete("svg");
    config.module
    .rule('svgIcon')
    .test(/\.svg$/)
    .include.add(resolve('src/assets/svgIcon'))
    .end()
    .use('svg-sprite-loader')
    .loader('svg-sprite-loader')
    .options({
      symbolId: 'icon-[name]'
    })
  },
  // css相关配置
  css: {
    // 启用 CSS modules
    modules: false,
    // 是否使用css分离插件
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {}
  },
  // webpack-dev-server 相关配置
  devServer: {
    host: '0.0.0.0',
    port: 80,
    https: false,
    hotOnly: false,
    proxy: null, // 设置代理
    before: app => {}
  },
  // enabled by default if the machine has more than 1 cores
  parallel: require('os').cpus().length > 1,
  // PWA 插件相关配置
  pwa: {},
  // 第三方插件配置
  pluginOptions: {
    // ...
  }
}
