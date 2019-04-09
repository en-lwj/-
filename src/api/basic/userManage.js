import request from '@/utils/request'

const api = {}

// 获取用户信息（所有）
api.getUserAll = (data) => {
  return request({
    url: '/user/all',
    method: 'post',
    data: data
  })
}

// 获取用户信息(分页)
api.getUserList = (params, data) => {
  return request({
    url: '/user/page',
    method: 'post',
    params: params,
    data: data
  })
}

// 删除用户
api.deleteUser = (id) => {
  return request({
    url: `/user/${id}`,
    method: 'delete'
  })
}

// 修改密码
api.updateUserPwd = (data) => {
  return request({
    url: `/user/changePassword`,
    method: 'put',
    data: data
  })
}

// 修改用户信息
api.updateUser = (data) => {
  return request({
    url: `/user/update`,
    method: 'put',
    data: data
  })
}

// 新增用户
api.addUser = (data) => {
  return request({
    url: '/user/add',
    method: 'post',
    data: data
  })
}
export default api
