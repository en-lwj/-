
import mock from '@/config/modules/mock'
import loginAPI from './modules/login'
import userManageAPI from './modules/basic/userManage'
import roleManageAPI from './modules/basic/roleManage'
import permissionAPI from './modules/basic/permission'

// 登录相关
mock.get('/user/info', loginAPI.getUserInfo)
mock.post('/auth/jwt/token', loginAPI.login)
mock.get('/auth/jwt/destroy', loginAPI.logout)

// 用户管理
mock.post('/user/all', userManageAPI.getUserAll)
mock.post('/user/page', userManageAPI.getUserList)
mock.delete('/user/:id', userManageAPI.deleteUser)
mock.put('/user/changePassword', userManageAPI.updatePwd)
mock.put('/user/update', userManageAPI.updateUser)
mock.post('/user/add', userManageAPI.addUser)

// 角色管理
mock.post('/role/page', roleManageAPI.getRoleList)
mock.delete('/role/:id', roleManageAPI.deleteRole)
mock.put('/role/update', roleManageAPI.updateRole)
mock.post('/role/add', roleManageAPI.addRole)
mock.get('/role/users/:id', roleManageAPI.getUsersByRoleId)
mock.put('/role/editRoleUser', roleManageAPI.setRoleUsers)

// 权限
mock.get('/permission/permissionTree', permissionAPI.getPermissionTree)
mock.get('/permission/getPermissionByRoleId', permissionAPI.getPermissionByRoleId)
mock.delete('/permission/:id', permissionAPI.deletePermissionById)
mock.put('/permission/update', permissionAPI.updatePermissionById)
mock.post('/permission/add', permissionAPI.addPermission)
mock.post('/permission/all', permissionAPI.getPermissionAll)

mock.default = false

// 执行
mock.run()

