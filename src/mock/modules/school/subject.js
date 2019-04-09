import Mock from 'mockjs'

const List = []
const queryList = []
const i = 0

const subject = ['语文', '数学', '英语']
const stage = ['小学', '初中', '高中']
stage.forEach(stage_item => {
  subject.forEach(subject_item => {
    List.push(Mock.mock({
      'id': i + 1,
      'stage': stage_item,
      'name': subject_item,
      description: Mock.mock('@cparagraph'),
      createTime: Mock.mock('@datetime'),
      isDelete: false
    }))
  })
})

export default {
  getSubjectAll: config => {
    const { stage } = config.query
    queryList.splice(0)
    List.forEach(item => {
      if ((stage === '' || stage === undefined || item.stage === stage) && !item.isDelete) {
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
  getSubjectList: config => {
    const { stage, pageSize = 20, pageNum = 1 } = config.query
    queryList.splice(0)
    List.forEach(item => {
      if ((stage === '' || stage === undefined || item.stage === stage) && !item.isDelete) {
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
  getSubject: config => {
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
  deleteSubject: config => {
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
  updateSubject: config => {
    const data = config.body
    const item = List.find(item => item.id === Number(data.id))
    Object.assign(item, data)
    return {
      status: 200,
      data: {},
      message: '请求成功'
    }
  },
  addSubject: config => {
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
