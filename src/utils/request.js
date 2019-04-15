import axios from 'axios'
import { Message } from 'element-ui'
// import store from '@/store'
import { getToken, removeToken } from '@/utils/Token'
import qs from 'qs'
import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000
})

// request interceptor
service.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
service.defaults.headers.delete['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
service.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
service.defaults.headers.put['Content-Type'] = 'application/json;charset=UTF-8'
service.interceptors.request.use(
  config => {
    // 添加公共请求头
    config.headers['Authorization'] = getToken() || ''
    // qs序列化请求参数
    if (config.headers['Content-Type'] && config.headers['Content-Type'].match('application/json') !== null) {
      // 发送json请求
    } else if (typeof config.data === 'object' &&
      config.headers['Content-Type'] &&
      config.headers['Content-Type'].match('x-www-form-urlencoded') !== null &&
      (config.method === 'post' || config.method === 'put')) {
      config.data = qs.stringify(config.data)
    } else if (config.data === undefined) {
      config.data = {}
    }
    // console.log(config)
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// respone interceptor
service.interceptors.response.use(
  response => {
    if (!response.data || response.data.message === '1') {
      Message({
        showClose: true,
        message: response.data.message || '返回数据格式不正确',
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject('返回数据格式不正确')
    }
    return response.data
  },
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过xmlhttprequest来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  // response => {
  //   const res = response.data
  //   if (res.code !== 20000) {
  //     Message({
  //       message: res.message,
  //       type: 'error',
  //       duration: 5 * 1000
  //     })
  //     // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
  //     if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
  //       // 请自行在引入 MessageBox
  //       // import { Message, MessageBox } from 'element-ui'
  //       MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
  //         confirmButtonText: '重新登录',
  //         cancelButtonText: '取消',
  //         type: 'warning'
  //       }).then(() => {
  //         store.dispatch('FedLogOut').then(() => {
  //           location.reload() // 为了重新实例化vue-router对象 避免bug
  //         })
  //       })
  //     }
  //     return Promise.reject('error')
  //   } else {
  //     return response.data
  //   }
  // },
  error => {
    console.log('err' + error) // for debug
    if (error.response && error.response.data && (error.response.data.status === 200204 || error.response.data.status === 200202)) {
      removeToken()
      router.push('/login')
    }
    Message({
      showClose: true,
      message: error.response && error.response.data && error.response.data.message || error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
