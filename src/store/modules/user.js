import loginApi from '@/api/login'
import Token from '@/utils/Token'
import { Message } from 'element-ui'

const user = {
  state: {
    token: Token.getToken(),
    setting: '',
    name: '',
    status: '',
    permission: undefined,
    // 头像
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80'
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_PERMISSION: (state, permission) => {
      state.permission = permission
    }
  },

  actions: {
    // 用户名登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      return new Promise((resolve, reject) => {
        loginApi.login({ username, password, code }).then(res => {
          if (res.status !== 200) {
            Message({
              message: res.message,
              type: 'error',
              showClose: true
            })
            reject(res)
          }
          commit('SET_TOKEN', res.data)
          Token.setToken(res.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        loginApi.getUserInfo(state.token).then(res => {
          if (!res) { // 由于mockjs 不支持自定义状态码只能这样hack
            reject('error')
          }
          const data = res

          if (data.permission) {
            commit('SET_PERMISSION', data.permission)
          }
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        Token.removeToken()
        loginApi.logout(state.token).then(() => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        Token.removeToken()
        resolve()
      })
    }
  }
}

export default user
