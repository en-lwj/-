import Vue from 'vue'
import Router from 'vue-router'

/* Layout */
import Layout from '@/views/main/layout/Layout'

import basicManage from './modules/basicManage'
import configManage from './modules/configManage'
import page from './modules/page'

Vue.use(Router)

/* Router Modules */

/** note: submenu only apppear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   如果“hidden:true”不会在侧边栏显示(default is false)
* alwaysShow: true               如果设置为true，将始终显示根菜单，无论它的子路径长度是多少
*                                如果不设置总路线，只在孩子们下面多走一条路线
*                                它将变成嵌套模式，否则不会显示根菜单
* redirect: noredirect           如果“重定向:noredirect”将不会在面包屑中重定向
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               名称显示在子菜单和面包屑中(推荐设置)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                如果为true，页面将不会被缓存(default is false)
  }
**/
export const constantRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/main/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/helper/404'),
    hidden: true
  },
  {
    path: '/svg',
    component: () => import('@/views/helper/svgIcons'),
    hidden: true
  },
  {
    path: '/ueditor',
    component: () => import('@/views/helper/ueditor'),
    hidden: true
  },
  {
    path: '/test',
    component: () => import('@/views/helper/test'),
    hidden: true
  },
  {
    path: '/panel',
    component: () => import('@/views/helper/yz-panel'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/main/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  basicManage,
  configManage,
  ...page

  // { path: '*', redirect: '/404', hidden: true }
]
