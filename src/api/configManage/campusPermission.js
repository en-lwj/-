import request from '@/utils/request'

const api = {}

// 获取权限信息（所有）
api.getPermissionAll = (params) => {
  return request({
    url: '/adminCampusPermission/all',
    method: 'post',
    params: params
  })
}

// 获取权限树
api.getPermissionTree = (params) => {
  return request({
    url: '/adminCampusPermission/permissionTree',
    method: 'get',
    params: params
  })
}

// 修改权限
api.updatePermission = (data) => {
  return request({
    url: `/adminCampusPermission/update`,
    method: 'put',
    data: data
  })
}

// 新增权限
api.addPermission = (data) => {
  return request({
    url: '/adminCampusPermission/add',
    method: 'post',
    data: data
  })
}

// 删除权限
api.deletePermission = (id) => {
  return request({
    url: `/adminCampusPermission/${id}`,
    method: 'delete'
  })
}

export default api
