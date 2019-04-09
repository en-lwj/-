import Mock from 'mockjs'

Mock.Random.extend({
  phoneName: function(date) {
    return Mock.mock(/^1(3|5|8)\d{9}/) + ' [' + Mock.mock('@first') + ']'
  }
})

let add_count = 1

const List = [{
  id: 1,
  code: 'P_ROOT',
  description: '',
  parentId: 0,
  permissionName: '管理系统',
  status: 'V',
  type: 'list',
  module: 'root',
  links: '/admin'
}, {
  id: 11,
  code: 'P_11',
  description: '',
  parentId: 1,
  permissionName: '基础管理',
  // 状态(V:启用，I:禁用)
  status: 'V',
  type: 'list',
  module: 'basicManage',
  links: '/basicManage'
}, {
  id: 12,
  code: 'P_12',
  description: '',
  parentId: 11,
  permissionName: '用户管理',
  // 状态(V:启用，I:禁用)
  status: 'V',
  type: 'list',
  module: 'userManage',
  links: '/userManage'
}, {
  id: 121,
  code: 'P_121',
  description: '',
  parentId: 12,
  permissionName: '搜索',
  status: 'V',
  type: 'btn',
  module: 'search',
  links: '/search'
}, {
  id: 122,
  code: 'P_122',
  description: '',
  parentId: 12,
  permissionName: '添加',
  status: 'V',
  type: 'btn',
  module: 'add',
  links: '/add'
}, {
  id: 13,
  code: 'P_13',
  description: '',
  parentId: 11,
  permissionName: '角色管理',
  status: 'V',
  type: 'list',
  module: 'roleManage',
  links: '/roleManage'
},
{
  id: 131,
  code: 'P_131',
  description: '',
  parentId: 13,
  permissionName: '搜索',
  status: 'V',
  type: 'btn',
  module: 'search',
  links: '/search'
}, {
  id: 132,
  code: 'P_132',
  description: '',
  parentId: 13,
  permissionName: '添加',
  status: 'V',
  type: 'btn',
  module: 'add',
  links: '/add'
}]

const Tree = []

export default {
  getPermissionAll: config => {
    return {
      status: 200,
      data: {
        rows: List,
        total: List.length
      },
      message: '请求成功'
    }
  },
  getPermissionTree: config => {
    Tree.splice(0)
    Tree.push(List.find(item => item.module === 'root'))
    // 递归生成权限树 data: []
    const generatorTree = (data) => {
      data.forEach(item => {
        item.children = List.filter(child => child.parentId === item.id)
        generatorTree(item.children)
      })
    }
    generatorTree(Tree)
    return {
      status: 200,
      data: {
        rows: Tree
      },
      message: '请求成功'
    }
  },
  getPermissionByRoleId: config => {
    // const { roleId } = config.params
    return {
      status: 200,
      data: {
        rows: []
      },
      message: '请求成功'
    }
  },
  deletePermissionById: config => {
    const { id } = config.params
    let flag = false
    const deleteById = (list, id) => {
      list.forEach((item, i) => {
        if (flag) return
        if (Number(item.id) === Number(id)) {
          list.splice(i, 1)
          flag = true
        } else {
          if (item.children) deleteById(item.children, id)
        }
      })
    }
    deleteById(List, id)
    if (flag) {
      return {
        status: 200,
        data: {},
        message: '请求成功'
      }
    }
    return {
      status: -1,
      data: {},
      message: '请求失败'
    }
  },
  updatePermissionById: config => {
    const { id } = config.data
    const obj = config.body
    let flag = false
    const updateById = (list, id) => {
      list.forEach((item, i) => {
        if (flag) return
        if (Number(item.id) === Number(id)) {
          Object.assign(item, obj)
          flag = true
        } else {
          if (item.children) updateById(item.children, id)
        }
      })
    }
    updateById(List, id)
    if (flag) {
      return {
        status: 200,
        data: {},
        message: '请求成功'
      }
    }
    return {
      status: -1,
      data: {},
      message: '请求失败'
    }
  },
  // { parent_id, data }
  addPermission: config => {
    const obj = config.body
    obj.id = parseInt(1000 + add_count++)
    let flag = false
    const addById = (list, id) => {
      list.forEach((item, i) => {
        if (flag) return
        if (item.id === Number(id)) {
          if (item.children) item.children.push(obj)
          else item.children = [obj]
          flag = true
        } else {
          if (item.children) addById(item.children, id)
        }
      })
    }
    addById(List, obj.parentId)
    if (flag) {
      return {
        status: 200,
        data: {},
        message: '请求成功'
      }
    }
    return {
      status: -1,
      data: {},
      message: '请求失败'
    }
  }
}
