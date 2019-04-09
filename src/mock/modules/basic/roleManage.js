import Mock from 'mockjs'

Mock.Random.extend({
  phoneName: function(date) {
    return Mock.mock(/^1(3|5|8)\d{9}/) + ' [' + Mock.mock('@first') + ']'
  }
})

// id;
// 是否可修改(1:是，0:否)
// Boolean canBeChange;
// 角色码(唯一)
// String code;
// 角色简介
// String description;
// 是否显示(1:是，0:否)
// Boolean isVisible;
// 角色名称
// String roleName;
// 状态(V:启用，I:禁用)
// String status;

const List = []
const queryList = []
const count = 6

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    'id': i + 1,
    'canBeChange|1': [true, false],
    code: Mock.mock('@guid'),
    description: Mock.mock('@cparagraph'),
    'isVisible|1': [true, false],
    'status|1': ['V', 'I'],
    'roleName': ['管理员', '普通用户', '试用用户', '销售', 'vip大佬', '土豪'][i]
  }))
}

export default {
  getRoleList: config => {
    const { pageNum = 1, pageSize = 20 } = config.query
    const { roleName, status } = config.body
    queryList.splice(0)
    List.forEach(item => {
      if ((roleName === '' || roleName === undefined || item.roleName.indexOf(roleName) !== -1) && (item.status === status || status === '')) {
        queryList.push(item)
      }
    })
    const pageList = queryList.filter((item, index) => index < pageSize * pageNum && index >= pageSize * (pageNum - 1))
    return {
      status: 200,
      data: {
        total: queryList.length,
        rows: pageList
      },
      message: '请求成功'
    }
  },
  deleteRole: config => {
    const { id } = config.params
    for (let i = 0; i < List.length; i++) {
      if (List[i].id === Number(id)) {
        List.splice(i, 1)
        return {
          status: 200,
          data: {},
          message: '请求成功'
        }
      }
    }
    return {
      status: -1,
      data: {},
      message: '请求失败'
    }
  },
  updateRole: config => {
    const { id } = config.body
    const data = config.body
    for (let i = 0; i < List.length; i++) {
      if (List[i].id === Number(id)) {
        Object.assign(List[i], data)
        return {
          status: 200,
          data: List[i],
          message: '请求成功'
        }
      }
    }
    return {
      status: -1,
      data: {},
      message: '角色不存在'
    }
  },
  addRole: config => {
    const data = config.body
    data.id = parseInt(1000 + Math.random() * 300)
    List.unshift(data)
    return {
      status: 200,
      data: {},
      message: '请求成功'
    }
  },
  // 更新角色用户列表
  setRoleUsers: config => {
    // const { roleId, userIds } = config.body
    // const users = roleUsers.find(item => Number(item.id) === Number(roleId))
    // users.data = userIds.split(',')
    return {
      status: 200,
      data: {},
      message: '请求成功'
    }
  }
}
