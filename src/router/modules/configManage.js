import Layout from '@/views/main/layout/Layout'
export default {
  path: '/config-manage',
  component: Layout,
  redirect: '/config-manage/school-manage',
  name: 'configManage',
  alwaysShow: true,
  meta: {
    title: 'configManage',
    icon: 'configManage'
  },
  children: [
    {
      path: 'school-manage',
      component: () => import('@/views/main/meun/configManage/schoolManage'),
      name: 'schoolManage',
      alwaysShow: true,
      meta: { title: 'schoolManage', noCache: true },
      children: [{
        path: 'role-config/:id(\\d+)',
        hidden: true,
        component: () => import('@/views/main/meun/configManage/schoolManage/children/roleConfig'),
        name: 'roleConfig',
        meta: { title: 'roleConfig', noCache: true }
      }, {
        path: 'school-permission',
        hidden: true,
        component: () => import('@/views/main/meun/configManage/schoolManage/children/schoolPermission'),
        name: 'schoolPermission',
        meta: { title: 'schoolPermission', noCache: true }
      }]
    }, {
      path: 'news-channel-manage',
      component: () => import('@/views/main/meun/configManage/newsChannelManage'),
      name: 'newsChannelManage',
      meta: { title: 'newsChannelManage', noCache: true }
    }, {
      path: 'news-template-manage',
      component: () => import('@/views/main/meun/configManage/newsTemplateManage'),
      name: 'newsTemplateManage',
      meta: { title: 'newsTemplateManage', noCache: true },
      children: [{
        path: 'news-template-item/:id(\\d+)',
        hidden: true,
        component: () => import('@/views/main/meun/configManage/newsTemplateManage/children/newsTemplateItems'),
        name: 'newsTemplateItem',
        meta: { title: 'newsTemplateItem', noCache: true }
      }]
    }
  ]
}
