import Mock from 'mockjs'

const List = []
const queryList = []
const count = 10
let i = 0
const stageList = ['小学', '初中', '高中']

for (let k = 1; k <= count; k++) {
  for (let j = 1; j <= stageList.length; j++) {
    i = k * j
    List.push(Mock.mock({
      'id': i,
      'stage': stageList[j - 1],
      'division': k + 2008,
      'name': 'XX年级',
      'sequence': 1000 + i,
      description: Mock.mock('@cparagraph'),
      createTime: Mock.mock('@datetime'),
      isDelete: false
    }))
  }
}
List.reverse()

export default {
  getGradeAll: config => {
    const { stage, division } = config.query
    queryList.splice(0)
    List.forEach(item => {
      if ((stage === '' || stage === undefined || item.stage === stage) &&
      (division === '' || division === undefined || item.division === division) &&
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
  getGradeList: config => {
    const { stage, division, pageSize = 20, pageNum = 1 } = config.query
    queryList.splice(0)
    List.forEach(item => {
      if ((stage === '' || stage === undefined || item.stage === stage) &&
      (division === '' || division === undefined || item.division === division) &&
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
  getGrade: config => {
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
  deleteGrade: config => {
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
  updateGrade: config => {
    const data = config.body
    const item = List.find(item => item.id === Number(data.id))
    Object.assign(item, data)
    return {
      status: 200,
      data: {},
      message: '请求成功'
    }
  },
  addGrade: config => {
    const data = config.body
    if (List.find(item => item.division === Number(data.division) && item.stage === data.stage && !item.isDelete)) {
      return {
        status: 1,
        data: {},
        message: '该年级已存在'
      }
    }
    data.id = parseInt(1000 + i)
    List.unshift(data)
    return {
      status: 200,
      data: {},
      message: '请求成功'
    }
  }
}
