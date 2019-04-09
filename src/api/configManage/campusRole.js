import request from '@/utils/request'

const api = {}

// 获取学校角色列表
api.getCampusRoleList = (params, data) => {
  return request({
    url: '/adminCampusRole/page',
    method: 'post',
    params: params,
    data: data
  })
}

// 获取学校角色列表
api.getCampusRoleAll = (data) => {
  return request({
    url: '/adminCampusRole/all',
    method: 'post',
    data: data
  })
}

// 获取某个学校角色信息
api.getCampusRoleById = (id) => {
  return request({
    url: `/adminCampusRole/get/${id}`,
    method: 'get'
  })
}

// 删除该学校角色
api.deleteCampusRole = (id) => {
  return request({
    url: `/adminCampusRole/${id}`,
    method: 'delete'
  })
}

// 修改学校角色
api.updateCampusRole = (query) => {
  return request({
    url: `/adminCampusRole/update`,
    method: 'put',
    data: query
  })
}

// 新增学校角色
api.addCampusRole = (query) => {
  return request({
    url: '/adminCampusRole/add',
    method: 'post',
    data: query
  })
}

// 获取角色权限
api.getCampusRolePermission = (data) => {
  return request({
    url: '/adminCampusRolePermissionMap/all',
    method: 'post',
    data: data
  })
}

// 修改角色权限
api.updateCampusRolePermission = (query) => {
  return request({
    url: `/adminCampusRole/editRolePermission`,
    method: 'put',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    data: query
  })
}

export default api
