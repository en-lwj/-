import Mock from 'mockjs'

const List = []
const queryList = []
const count = 300
let i = 0

for (i = 0; i <= count; i++) {
  List.push(Mock.mock({
    'id': i + 1,
    'thumbnail|1': ['https://i01piccdn.sogoucdn.com/6bff6f384b6991dc', 'http://www.17qq.com/img_qqtouxiang/76884603.jpeg'],
    name: Mock.mock('@cname'),
    'division|1': ['2018', '2017', '2016'],
    'admissionSchool|1': ['哈佛大学', '清华大学', '北京大学', '中山大学'],
    'admissionMajor|1': ['软件工程', '建筑学', '环境工程', '通信工程'],
    admissionTime: '@datetime',
    'stage|1': ['小学', '初中', '高中'],
    'gradeId': Mock.mock('@natural(1, 10)'),
    'clazzId': Mock.mock('@natural(1, 10)'),
    'clazzName': '@clazzId 班',
    isDelete: false
  }))
}

export default {
  getTopStudentList: config => {
    const { division, clazzId, stage, pageSize = 20, pageNum = 1 } = config.query
    queryList.splice(0)
    List.forEach(item => {
      if ((division === '' || division === undefined || Number(item.division) === Number(division)) &&
        (clazzId === '' || clazzId === undefined || item.clazzId === Number(clazzId)) &&
        (stage === '' || stage === undefined || item.stage === stage) &&
        !item.isDelete) {
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
  getTopStudent: config => {
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
  deleteTopStudent: config => {
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
  updateTopStudent: config => {
    const data = config.body
    const item = List.find(item => item.id === Number(data.id))
    Object.assign(item, data)
    return {
      status: 200,
      data: {},
      message: '请求成功'
    }
  },
  addTopStudent: config => {
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
