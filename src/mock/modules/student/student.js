import Mock from 'mockjs'

const List = []
const queryList = []
const count = 100
let i = 0

for (i = 0; i <= count; i++) {
  List.push(Mock.mock({
    'id': i + 1,
    'address': 'string',
    'area': 'string',
    'birthday': 'string',
    'city': 'string',
    'createTime': Mock.mock('@datetime'),
    'gender|0': [0, 1],
    'idCardNumber': '440800000000000000',
    'idCardType': '身份证',
    'name': '@first',
    'nation': '汉族',
    'politicalStatus': '共青团员',
    'province': Mock.mock('@county(true)'),
    'remark': '',
    'clazzId': i + 1,
    'clazzName': Mock.mock('@integer(1, 22)') + '班',
    'enrolmentTime': Mock.mock('@datetime'),
    'gradeId': i + 1,
    'gradeName': Mock.mock('@integer(1, 6)') + '年级',
    'graduationTime': Mock.mock('@datetime'),
    'headImgPath': 'https://i01piccdn.sogoucdn.com/6bff6f384b6991dc',
    'headThumbnailPath': 'https://i01piccdn.sogoucdn.com/6bff6f384b6991dc',
    'status': '在读',
    'stuNumber': Mock.mock('@id'),
    'recordId': i + 1,
    'division|1': [2016, 2017, 2018],
    'stage|1': ['小学', '初中', '高中'],
    isDelete: false
  }))
}

export default {
  studentInfoList: config => {
    const { name, clazzId, gradeId, division, stuNumber, stage } = config.query
    queryList.splice(0)
    List.forEach(item => {
      if ((name === '' || name === undefined || item.name.indexOf(name) !== -1) &&
        (stuNumber || stuNumber === item.stuNumber) &&
        (clazzId || clazzId === item.clazzId) &&
        (gradeId || gradeId === item.gradeId) &&
        (division || division === item.division) &&
        (stage || stage === item.stage) &&
        !item.isDelete) {
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
    const { name, pageSize = 1, pageNum = 20 } = config.query
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
