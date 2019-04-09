import Mock from 'mockjs'

Mock.Random.extend({
  phoneName: function(date) {
    return Mock.mock(/^1(3|5|8)\d{9}/) + ' [' + Mock.mock('@first') + ']'
  }
})

const List = []
const queryList = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    'id': i + 1,
    lastLogin: Mock.mock('@datetime'),
    realName: '@first',
    'roleNames|1': ['管理员', '普通用户'],
    'loginCount|0-100': 1,
    'status|1': ['V', 'I'],
    username: /^1(3|5|8)\d{9}/,
    staffNumber: /^1(3|5|8)\d{9}/
  }))
}

export default {
  getUserAll: config => {
    const data = config.body
    queryList.splice(0)
    List.forEach(item => {
      const flag = Object.keys(data).every(key => {
        return data[key] === '' || data[key] === undefined || item[key] && item[key].indexOf(data[key]) !== -1
      })
      if (flag) queryList.push(item)
    })
    return {
      status: 200,
      data: {
        total: queryList.length,
        rows: queryList
      },
      message: '请求成功'
    }
  },
  getUserList: config => {
    const { pageNum = 1, pageSize = 20 } = config.query
    const { username, status } = config.body
    queryList.splice(0)
    List.forEach(item => {
      if ((username === '' || username === undefined || item.username.indexOf(username) !== -1) && (item.status === status || status === '')) {
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
  deleteUser: config => {
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
  updatePwd: config => {
    return {
      status: 200,
      data: {},
      message: '请求成功'
    }
  },
  updateUser: config => {
    const { id } = config.body
    for (let i = 0; i < List.length; i++) {
      if (List[i].id === Number(id)) {
        Object.assign(List[i], config.body)
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
  addUser: config => {
    const data = config.body
    data.id = parseInt(1000 + Math.random() * 300)
    List.unshift(data)
    return {
      status: 200,
      data: {},
      message: '请求成功'
    }
  }
}

