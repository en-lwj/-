import request from '@/utils/request'

const api = {}

// 获取角色信息
api.getRoleList = (params, data) => {
  return request({
    url: '/role/page',
    method: 'post',
    params: params,
    data: data
  })
}

// 删除角色
api.deleteRole = (id) => {
  return request({
    url: `/role/${id}`,
    method: 'delete'
  })
}

// 修改角色
api.updateRole = (data) => {
  return request({
    url: `/role/update`,
    method: 'put',
    data: data
  })
}

// 新增角色
api.addRole = (query) => {
  return request({
    url: '/role/add',
    method: 'post',
    data: query
  })
}

// 获取角色所有用户id数组
api.getUsersByRoleId = (id) => {
  return request({
    url: `/role/users/${id}`,
    method: 'get'
  })
}

// 给角色分配用户
api.setRoleUsers = (data) => {
  return request({
    url: '/role/editRoleUser',
    method: 'put',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    data: data
  })
}

// 给角色分配权限
api.setRolePermission = (data) => {
  return request({
    url: '/role/editRolePermission',
    method: 'put',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    data: data
  })
}

export default api
