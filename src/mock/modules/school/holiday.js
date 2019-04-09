import Mock from 'mockjs'

const List = []
const queryList = []
const count = 10
let i = 0

for (i = 0; i <= count; i++) {
  List.push(Mock.mock({
    'id': i + 1,
    'name': 'XX假期' + (i + 1),
    description: Mock.mock('@cparagraph'),
    createTime: Mock.mock('@datetime'),
    startTime: Mock.mock('@datetime'),
    endTime: Mock.mock('@datetime'),
    isDelete: false
  }))
}

export default {
  getHolidayAll: config => {
    const { name } = config.query
    queryList.splice(0)
    List.forEach(item => {
      if ((name === '' || name === undefined || item.name.indexOf(name) !== -1) && !item.isDelete) {
        queryList.push(item)
      }
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
  getHolidayList: config => {
    const { name, pageSize = 20, pageNum = 1 } = config.query
    queryList.splice(0)
    List.forEach(item => {
      if ((name === '' || name === undefined || item.name.indexOf(name) !== -1) && !item.isDelete) {
        queryList.push(item)
      }
    })
    const pageList = queryList.filter((item, index) => index < pageNum * pageSize && index >= pageSize * (pageNum - 1))
    return {
      status: 200,
      data: {
        total: queryList.length,
        rows: pageList
      },
      message: '请求成功'
    }
  },
  getHoliday: config => {
    const { id } = config.params
    for (let i = 0; i < List.length; i++) {
      if (List[i].id === Number(id) && !List[i].isDelete) {
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
  deleteHoliday: config => {
    const { id } = config.params
    for (let i = 0; i < List.length; i++) {
      if (List[i].id === Number(id) && !List[i].isDelete) {
        List[i].isDelete = true
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
  updateHoliday: config => {
    const data = config.body
    const item = List.find(item => item.id === Number(data.id))
    Object.assign(item, data)
    return {
      status: 200,
      data: {},
      message: '请求成功'
    }
  },
  addHoliday: config => {
    const data = config.body
    data.id = parseInt(1000 + i)
    List.unshift(data)
    return {
      status: 200,
      data: {},
      message: '请求成功'
    }
  }
}
