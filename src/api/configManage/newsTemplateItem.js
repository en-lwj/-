import request from '@/utils/request'

const api = {}

// 获取资讯模版属性信息
api.getNewsTemplateItemList = (params, data) => {
  return request({
    url: '/adminNewsTemplateItems/page',
    method: 'post',
    params: params,
    data: data
  })
}

// 获取资讯模版属性信息(所有)
api.getNewsTemplateItemAll = (data) => {
  return request({
    url: '/adminNewsTemplateItems/all',
    method: 'post',
    data: data
  })
}

// 删除资讯模版属性
api.deleteNewsTemplateItem = (id) => {
  return request({
    url: `/adminNewsTemplateItems/${id}`,
    method: 'delete'
  })
}

// 修改资讯模版属性
api.updateNewsTemplateItem = (data) => {
  return request({
    url: `/adminNewsTemplateItems/update`,
    method: 'put',
    data: data
  })
}

// 新增资讯模版属性
api.addNewsTemplateItem = (query) => {
  return request({
    url: '/adminNewsTemplateItems/add',
    method: 'post',
    data: query
  })
}

export default api
