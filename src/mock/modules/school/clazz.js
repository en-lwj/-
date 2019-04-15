import Mock from 'mockjs'

const List = []
const queryList = []
const count = 10
let i = 0
const Tree = []
const stageList = ['小学', '初中', '高中']

for (i = 0; i <= count; i++) {
  List.push(Mock.mock({
    'id': i + 1,
    'stage|1': stageList,
    'division': 2018,
    'name': i + 1 + '年级',
    'sequence': 1000 + i,
    'gradeId|1': [11],
    'gradeName': 'XX年级',
    description: Mock.mock('@cparagraph'),
    createTime: Mock.mock('@datetime'),
    isDelete: false
  }))
}
List.reverse()

// 生成班级树
for (let y = 2008; y <= new Date().getFullYear(); y++) {
  const year_obj = { label: y, type: 'division', children: [] }
  for (let j = 1; j <= stageList.length; j++) {
    const stage_obj = { label: stageList[j - 1], type: 'stage', children: [] }
    const clazzCount = parseInt(Math.random() * 10)
    for (let c = 0; c < clazzCount; c++) {
      const clazz_obj = { label: c + 1 + '班', type: 'clazz', id: c + 1 }
      stage_obj.children.push(clazz_obj)
    }
    year_obj.children.push(stage_obj)
  }
  Tree.push(year_obj)
}
Tree.reverse()

export default {
  // 获取班级树（届别-学段-班级）
  getClazzTree: config => {
    return {
      status: 200,
      data: {
        rows: Tree
      },
      message: '请求成功'
    }
  },
  // 获取全部班级列表
  getClazzAll: config => {
    const { stage, division } = config.query
    queryList.splice(0)
    List.forEach(item => {
      if ((stage === '' || stage === undefined || item.stage === stage) &&
      (division === '' || division === undefined || item.division === Number(division)) &&
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
  // 获取班级列表（分页）
  getClazzList: config => {
    const { stage, division, pageSize = 20, pageNum = 1 } = config.query
    queryList.splice(0)
    List.forEach(item => {
      if ((stage === '' || stage === undefined || item.stage === stage) &&
      (division === '' || division === undefined || item.division === Number(division)) &&
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
  // 获取单个班级信息
  getClazz: config => {
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
  // 删除班级
  deleteClazz: config => {
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
  // 修改班级信息
  updateClazz: config => {
    const data = config.body
    const item = List.find(item => item.id === Number(data.id))
    Object.assign(item, data)
    return {
      status: 200,
      data: {},
      message: '请求成功'
    }
  },
  // 新增班级
  addClazz: config => {
    const data = config.body
    data.id = parseInt(1000 + i)
    data.division = Number(data.division)
    data.stage = data.stage || undefined
    List.unshift(data)
    return {
      status: 200,
      data: {},
      message: '请求成功'
    }
  }
}
