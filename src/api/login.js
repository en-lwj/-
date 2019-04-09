import request from '@/utils/request'

const api = {}

// 登录
api.login = (query) => {
  return request({
    url: `/auth/jwt/token`,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    data: query
  })
}

// 退出登录
api.logout = () => {
  return request({
    url: '/auth/jwt/destroy',
    method: 'get'
  })
}

export default api
