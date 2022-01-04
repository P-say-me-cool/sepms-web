import request from '@/utils/request'

// 根据日期 班次 工厂 状态查询罐状态信息
export function potListApi(query) {
  return request({
    url: '/material/currencyUnlock/potStatusList/',
    method: 'get',
    params: query
  })
}

// 根据日期 班次 工厂 状态查询装置状态信息
export function deviceListApi(query) {
  return request({
    url: '/material/currencyUnlock/deviceStatusList/',
    method: 'get',
    params: query
  })
}
// 根据日期 班次 工厂 状态查询进出厂状态信息
export function inOutListApi(query) {
  return request({
    url: '/material/currencyUnlock/inoutStatusList/',
    method: 'get',
    params: query
  })
}
// 根据日期 班次 工厂 状态查询互工厂点状态信息
export function mutualListApi(query) {
  return request({
    url: '/material/currencyUnlock/mutualStatusList/',
    method: 'get',
    params: query
  })
}
// 罐解锁
export function submitRemovePot(data) {
  return request({
    url: '/material/currencyUnlock/potSubmitRemove',
    method: 'post',
    data: data
  })
}
// 装置解锁
export function submitRemoveDevice(query) {
  return request({
    url: '/material/currencyUnlock/deviceSubmitRemove',
    method: 'post',
    data: query
  })
}
// 进出厂点解锁
export function submitRemoveInout(data) {
  return request({
    url: '/material/currencyUnlock/inoutSubmitRemove',
    method: 'post',
    data: data
  })
}
//互工厂点解锁
export function submitRemoveMutual(data){
  return request({
    url:'/material/currencyUnlock/mutualSubmitRemove',
    method: 'post',
    data: data
  })
}
