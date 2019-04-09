import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/assets/styles/index.scss' // global css

import 'babel-polyfill'

import App from './App'
import router from './router'
import store from './store'
import i18n from './lang'

// 由于配置层config很多用到了Common里的方法，所以Common要前置引入
// 设置公共方法
import Common from './utils/common'
window.Common = Vue.prototype.Common = Common

// 配置
import './config'

// 注册全局指令
import './directive'

// 注册全局组件
import './components'

// 模拟后台返回数据
if (process.env.NODE_ENV === 'development') {
  window.Vue = Vue
  // require('./mock')
}

Vue.use(Element, {
  size: 'small', // set element-ui default size  (medium, small, mini)
  i18n: (key, value) => i18n.t(key, value)
})

console.log('\n%c　　　　　　　 影子教育\n%cSHADOW%cEDU\n', 'font-family: Helvetica, Arial, sans-serif;font-size:28px;color:#000;font-weight: 700;', 'font-family: Helvetica, Arial, sans-serif;font-size:48px;color:#000;font-weight: 700;', 'font-family: Helvetica, Arial, sans-serif;font-size:48px;color:#00bbee;font-weight: 700;')

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})

