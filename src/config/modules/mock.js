// EXPRESS所用到的路径转正则库
import pathTo from 'path-to-regexp'
// axios的模拟调试器
// axios-mock-adapter会与mock拦截冲突，只弄使用mock生成数据，不能再用拦截
import MockAdapter from 'axios-mock-adapter'
import axios from '@/utils/request'
import qs from 'qs'
import Mock from 'mockjs'
const AdapterMock = new MockAdapter(axios)

const MockApi = window.MockApi = []
const accept = {
  // 当路由没有匹配时，是否发送真实请求
  default: true,
  sendDefault: () => {
    AdapterMock.onAny().reply(config => {
      AdapterMock.restore()
      axios(config)
      AdapterMock.reset()
    })
  }
}

const timeout = 0 * Math.random()

const httpMethods = ['get', 'post', 'patch', 'put', 'delete', 'head', 'options', 'any']

httpMethods.forEach(type => {
  // 接受路由存储起来
  accept[type] = function(RexUrl, callback) {
    MockApi.push({
      type: type,
      RexUrl: RexUrl,
      callback: callback
    })
  }
})

// 实例化路由拦截
accept.run = function() {
  MockApi.forEach(({ type, RexUrl, callback }) => {
    const mockMethod = 'on' + type.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
    const keys = []
    let rurl = ''
    if (RexUrl === '*') rurl = /(\s\S)*/
    else {
      rurl = pathTo(RexUrl, keys, {
        // 不忽略大小写
        sensitive: true,
        strict: true
      })
      const urlString = rurl
        .toString()
        .slice(1, -1)
        // .replace('^', baseUrl)
        .replace('$', '(\\?{0}|\\?{1}\\S*)$')
        // 重新编译正则规则
      rurl.compile(urlString)
    }

    AdapterMock[mockMethod](rurl).reply(async config => {
      let key_value = rurl.exec(config.url.replace(config.baseURL, ''))
      if (key_value !== null) key_value = key_value.slice(1)
      const params = {}
      keys.forEach((item, i) => {
        params[item.name] = key_value[i]
      })
      const data = {
        ...config,
        body: config.data || {},
        query: config.params || {},
        params: params
      }
      if (typeof data.body === 'string') {
        try {
          data.body = JSON.parse(config.data)
        } catch (e) {
          data.body = qs.parse(config.data)
        }
      }
      const result = await new Promise(resolve => {
        setTimeout(() => {
          resolve(Mock.mock(callback.call(config, data)))
        }, timeout)
      })
      return [200, result]
    })
  })
  // 执行默认函数
  if (accept.default) accept.sendDefault()
}

export default accept
