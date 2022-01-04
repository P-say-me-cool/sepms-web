import { login, logout, getInfo, refreshToken } from '@/api/login'
import { getToken, setToken, setExpiresIn, removeToken } from '@/utils/auth'
import { encryptByDES } from '@/api/secret'

const user = {
  state: {
    token: getToken(),
    userId:'',
    name: '',
    nickName:'',
    avatar: '',
    roles: [],
    permissions: [],
    dataPermissions: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_EXPIRES_IN: (state, time) => {
      state.expires_in = time
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_USER_ID: (state, userId) => {
      state.userId = userId
    },
    SET_NICKNAME: (state, nickName) => {
      state.nickName = nickName
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_DATA_PERMISSIONS: (state, dataPermissions) => {
      state.dataPermissions = dataPermissions
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = encryptByDES(userInfo.password)
      const code = userInfo.code
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid).then(res => {
          let data = res.data
          setToken(data.access_token)
          commit('SET_TOKEN', data.access_token)
          setExpiresIn(data.expires_in)
          commit('SET_EXPIRES_IN', data.expires_in)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(res => {
          const user = res.user
          const avatar = user.avatar == "" ? require("@/assets/images/profile.png") : user.avatar;
          if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', res.roles)
            commit('SET_PERMISSIONS', res.permissions)
          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT'])
          }
          commit('SET_NICKNAME',user.nickName)
          commit('SET_NAME', user.userName)
          commit('SET_USER_ID', user.userId)
          commit('SET_AVATAR', avatar)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户界面数据权限信息
    GetDataPro({ commit, state }) {
      return new Promise((resolve, reject) => {
        getDataPro(state.token).then(res => {
          if (res.dataPermissions) { // 验证返回的dataPermissions是否是一个非空数组
            commit('SET_DATA_PERMISSIONS', res.dataPermissions)
          }
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 刷新token
    RefreshToken({commit, state}) {
      return new Promise((resolve, reject) => {
        refreshToken(state.token).then(res => {
          setExpiresIn(res.data)
          commit('SET_EXPIRES_IN', res.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_PERMISSIONS', [])
      removeToken()
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
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
        removeToken()
        resolve()
      })
    }
  }
}

export default user
