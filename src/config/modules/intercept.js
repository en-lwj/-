// 路由拦截器
import router from '@/router'
import store from '@/store'
// import { Message } from 'element-ui'
// 进度条
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import Token from '@/utils/Token' // getToken from cookie

// 禁用进度环
NProgress.configure({ showSpinner: false })

// 路由拦截白名单
const whiteList = ['/login']

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (!Token.getToken()) {
    // 在免登录白名单，直接进入
    if (whiteList.indexOf(to.path) !== -1) next()
    else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done()
    }
  } else {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.getters.permission === undefined) { // 判断当前用户是否已拉取完user_info信息
        store.commit('SET_PERMISSION', '*')
        const permission = []
        store.dispatch('GenerateRoutes', { permission }).then(() => { // 根据roles权限生成可访问的路由表
          router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
          router.addRoutes([{ path: '*', redirect: '/404', hidden: true }])
          next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
        })
      } else {
        next()
      }
      // if (store.getters.permission === undefined) { // 判断当前用户是否已拉取完user_info信息
      //   store.dispatch('GetUserInfo').then(res => { // 拉取user_info
      //     const permission = res.permission
      //     store.dispatch('GenerateRoutes', { permission }).then(() => { // 根据roles权限生成可访问的路由表
      //       router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
      //       router.addRoutes([{ path: '*', redirect: '/404', hidden: true }])
      //       next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
      //     })
      //   }).catch((err) => {
      //     store.dispatch('FedLogOut').then(() => {
      //       Message.error(err || 'Verification failed, please login again')
      //       next({ path: '/' })
      //       NProgress.done()
      //     })
      //   })
      // } else {
      //   store.dispatch('GetPagePermission', to).then(() => {
      //     next()
      //   })
      // }
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
