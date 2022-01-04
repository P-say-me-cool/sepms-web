import request from '@/utils/request'

const client_id = 'web'
const client_secret = '123456'
const scope = 'server'

// 登录方法
export function login(username, password, code, uuid) {
  return request({
    url: '/auth/login',
    method: 'post',
    data: { username, password, code, uuid }
  })
}
// 登录方法
export function loginSSO(token) {
  return request({
    url: '/auth/sso?token='+token,
    method: 'get'
  })
}

// 刷新方法
export function refreshToken() {
  return request({
    url: '/auth/refresh',
    method: 'post'
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/system/user/getInfo',
    method: 'get'
  })
}
// 获取用户界面数据绑定信息
export function getDataPro() {
  return request({
    url: '/system/user/getDataPro',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'delete'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/code',
    method: 'get'
  })
}

// 获取token
export function getToken(query) {
  return request({
    url: '/system/user/api/token',
    method: 'get',
    params: query
  })
}
