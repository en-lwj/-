import Layout from '@/views/main/layout/Layout'
export default {
  path: '/basic-manage',
  component: Layout,
  redirect: '/basic-manage/user-manage',
  name: 'basicManage',
  alwaysShow: true,
  meta: {
    title: 'basicManage',
    icon: 'basicManage'
  },
  children: [
    {
      path: 'user-manage',
      component: () => import('@/views/main/meun/basicManage/userManage'),
      name: 'userManage',
      meta: { title: 'userManage', noCache: true }
    }, {
      path: 'role-manage',
      component: () => import('@/views/main/meun/basicManage/roleManage'),
      name: 'roleManage',
      meta: { title: 'roleManage', noCache: true }
    }, {
      path: 'permission-manage',
      component: () => import('@/views/main/meun/basicManage/permissionManage'),
      name: 'permissionManage',
      meta: { title: 'permissionManage', noCache: true }
    }
  ]
}
