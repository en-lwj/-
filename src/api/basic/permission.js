import request from '@/utils/request'

const api = {}

// 获取权限信息（所有）
api.getPermissionAll = (params) => {
  return request({
    url: '/permission/all',
    method: 'post',
    params: params
  })
}

// 获取权限树
api.getPermissionTree = (params) => {
  return request({
    url: '/permission/permissionTree',
    method: 'get',
    params: params
  })
}

// 获取角色权限
api.getPermissionByRoleId = (params) => {
  return request({
    url: '/permission/getPermissionByRoleId',
    method: 'get',
    params: params
  })
}

// 修改权限
api.updatePermission = (data) => {
  return request({
    url: `/permission/update`,
    method: 'put',
    data: data
  })
}

// 新增权限
api.addPermission = (data) => {
  return request({
    url: '/permission/add',
    method: 'post',
    data: data
  })
}

// 删除权限
api.deletePermission = (id) => {
  return request({
    url: `/permission/${id}`,
    method: 'delete'
  })
}

export default api
