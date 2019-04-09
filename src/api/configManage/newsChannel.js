import request from '@/utils/request'

const api = {}

// 获取资讯栏目列表
api.getNewsChannelList = (params, data) => {
  return request({
    url: '/adminNewsChannels/page',
    method: 'post',
    params: params,
    data: data
  })
}

// 获取资讯栏目列表
api.getNewsChannelTree = (params) => {
  return request({
    url: '/adminNewsChannels/allChannelTree',
    method: 'get',
    params: params
  })
}

// 获取资讯栏目列表（所有）
api.getNewsChannelAll = (data) => {
  return request({
    url: '/adminNewsChannels/all',
    method: 'post',
    data: data
  })
}

// 获取某个资讯栏目信息
api.getNewsChannelById = (id) => {
  return request({
    url: `/adminNewsChannels/get/${id}`,
    method: 'get'
  })
}

// 删除该资讯栏目
api.deleteNewsChannel = (id) => {
  return request({
    url: `/adminNewsChannels/${id}`,
    method: 'delete'
  })
}

// 修改资讯栏目
api.updateNewsChannel = (query) => {
  return request({
    url: `/adminNewsChannels/update`,
    method: 'put',
    data: query
  })
}

// 新增资讯栏目
api.addNewsChannel = (query) => {
  return request({
    url: '/adminNewsChannels/add',
    method: 'post',
    data: query
  })
}

export default api
