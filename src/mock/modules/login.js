
const List = [{
  id: 1,
  code: 'P_ROOT',
  description: '',
  parentId: 0,
  permissionName: '管理系统',
  // 状态(V:启用，I:禁用)
  status: 'V',
  type: 'list',
  // links 改为 module
  module: 'root',
  links: '/admin',
  children: [{
    id: 11,
    code: 'P_11',
    description: '',
    parentId: 1,
    permissionName: '基础管理',
    // 状态(V:启用，I:禁用)
    status: 'V',
    type: 'list',
    // links 改为 module
    module: 'basicManage',
    links: '/basicManage',
    children: [{
      id: 12,
      code: 'P_12',
      description: '',
      parentId: 11,
      permissionName: '用户管理',
      // 状态(V:启用，I:禁用)
      status: 'V',
      type: 'list',
      // links 改为 module
      module: 'userManage',
      links: '/userManage',
      children: [{
        id: 121,
        code: 'P_121',
        description: '',
        parentId: 12,
        permissionName: '搜索',
        // 状态(V:启用，I:禁用)
        status: 'V',
        type: 'btn',
        // links 改为 module
        module: 'search',
        links: '/search'
      }, {
        id: 122,
        code: 'P_122',
        description: '',
        parentId: 12,
        permissionName: '添加',
        // 状态(V:启用，I:禁用)
        status: 'V',
        type: 'btn',
        // links 改为 module
        module: 'add',
        links: '/add'
      }]
    }, {
      id: 13,
      code: 'P_13',
      description: '',
      parentId: 11,
      permissionName: '角色管理',
      // 状态(V:启用，I:禁用)
      status: 'V',
      type: 'list',
      // links 改为 module
      module: 'roleManage',
      links: '/roleManage',
      children: [{
        id: 131,
        code: 'P_131',
        description: '',
        parentId: 13,
        permissionName: '搜索',
        // 状态(V:启用，I:禁用)
        status: 'V',
        type: 'btn',
        // links 改为 module
        module: 'search',
        links: '/search'
      }, {
        id: 132,
        code: 'P_132',
        description: '',
        parentId: 13,
        permissionName: '添加',
        // 状态(V:启用，I:禁用)
        status: 'V',
        type: 'btn',
        // links 改为 module
        module: 'add',
        links: '/add'
      }]
    }, {
      id: 14,
      code: 'P_14',
      description: '',
      parentId: 11,
      permissionName: '权限管理',
      // 状态(V:启用，I:禁用)
      status: 'V',
      type: 'list',
      // links 改为 module
      module: 'permissionManage',
      links: '/permissionManage',
      children: [{
        id: 141,
        code: 'P_141',
        description: '',
        parentId: 14,
        permissionName: '搜索',
        // 状态(V:启用，I:禁用)
        status: 'V',
        type: 'btn',
        // links 改为 module
        module: 'search',
        links: '/search'
      }, {
        id: 142,
        code: 'P_142',
        description: '',
        parentId: 14,
        permissionName: '添加',
        // 状态(V:启用，I:禁用)
        status: 'V',
        type: 'btn',
        // links 改为 module
        module: 'add',
        links: '/add'
      }]
    }]
  }]
}]

const userMap = {
  admin: {
    roles: ['admin'],
    token: 'admin',
    introduction: '我是超级管理员',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin',
    permission: List
  },
  editor: {
    roles: ['editor'],
    token: 'editor',
    introduction: '我是编辑',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor',
    permission: []
  }
}

export default {
  login: config => {
    const { username } = config.body
    if (userMap[username]) {
      return {
        status: 200,
        data: 'admin',
        message: '登录成功'
      }
    } else {
      return {
        status: 200202,
        data: {},
        message: 'Username or Password is wrong'
      }
    }
  },
  getUserInfo: config => {
    const { token } = config.query
    if (userMap[token]) {
      return userMap[token]
    } else {
      return {
        status: '1',
        message: 'token失效！请重新登录'
      }
    }
  },
  logout: () => {
    return {
      status: 200,
      data: {},
      message: '请求成功'
    }
  }
}
