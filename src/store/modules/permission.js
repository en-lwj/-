import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, permission) {
  // const accessedRouters = asyncRouterMap.filter(route => {
  //   const permission_item = permission.find(item => item.module === route.name)
  //   if (permission_item !== undefined) {
  //     if (route.children && route.children.length && permission_item.children && permission_item.children.length) {
  //       route.children = filterAsyncRouter(route.children, permission_item.children)
  //     }
  //     return true
  //   }
  //   return false
  // })
  // 测试先返回所有路由
  return asyncRouterMap
  // return accessedRouters
}

const permission = {
  state: {
    // 页面可访问路由
    routers: constantRouterMap,
    // 异步添加的路由
    addRouters: [],
    // 当前页面权限
    pagePermission: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    // 设置页面权限
    SET_PAGE_PERMISSION: (state, pagePermission) => {
      state.pagePermission = pagePermission
    }
  },
  actions: {
    // 生成页面可访问路由
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const permission = data.permission || []
        let permission_arr = []
        if (permission[0] && permission[0].children && permission[0].children.length) {
          permission_arr = permission[0].children
        }
        let accessedRouters = filterAsyncRouter(asyncRouterMap, permission_arr)
        accessedRouters = asyncRouterMap
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    },
    /**
     * 获取页面权限
     * @param {*} to 进入页面的route对象
     */
    GetPagePermission({ commit, rootState }, to) {
      return new Promise(resolve => {
        const matched = to.matched || []
        let res = rootState.user.permission || []
        if (res[0] && res[0].children) res = res[0].children
        for (let i = 0; i < matched.length; i++) {
          const permission_item = res.find(item => item.module === matched[i].name)
          if (permission_item && permission_item.children) res = permission_item.children
          else {
            res = []
            break
          }
        }
        commit('SET_PAGE_PERMISSION', res)
        resolve()
      })
    }
  }
}

export default permission
