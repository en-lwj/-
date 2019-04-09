import request from '@/utils/request'

const api = {}

// 获取学校列表
api.getCampusList = (params, data) => {
  return request({
    url: '/adminCampus/page',
    method: 'post',
    params: params,
    data: data
  })
}

// 获取学校列表
api.getCampusAll = (data) => {
  return request({
    url: '/adminCampus/all',
    method: 'post',
    data: data
  })
}

// 获取某个学校信息
api.getCampusById = (id) => {
  return request({
    url: `/adminCampus/get/${id}`,
    method: 'get'
  })
}

// 删除该学校
api.deleteCampus = (id) => {
  return request({
    url: `/adminCampus/${id}`,
    method: 'delete'
  })
}

// 修改学校
api.updateCampus = (query) => {
  return request({
    url: `/adminCampus/update`,
    method: 'put',
    data: query
  })
}

// 新增学校
api.addCampus = (query) => {
  return request({
    url: '/adminCampus/add',
    method: 'post',
    data: query
  })
}

export default api
