import request from '@/utils/request'

const api = {}

// 获取资讯模版信息
api.getNewsTemplateList = (params, data) => {
  return request({
    url: '/adminNewsTemplates/page',
    method: 'post',
    params: params,
    data: data
  })
}

// 获取资讯模版信息(所有)
api.getNewsTemplateAll = (data) => {
  return request({
    url: '/adminNewsTemplates/all',
    method: 'post',
    data: data
  })
}

// 获取资讯模版信息
api.getNewsTemplateById = (id) => {
  return request({
    url: `/adminNewsTemplates/get/${id}`,
    method: 'get'
  })
}

// 删除资讯模版
api.deleteNewsTemplate = (id) => {
  return request({
    url: `/adminNewsTemplates/${id}`,
    method: 'delete'
  })
}

// 修改资讯模版
api.updateNewsTemplate = (data) => {
  return request({
    url: `/adminNewsTemplates/update`,
    method: 'put',
    data: data
  })
}

// 新增资讯模版
api.addNewsTemplate = (query) => {
  return request({
    url: '/adminNewsTemplates/add',
    method: 'post',
    data: query
  })
}

export default api
