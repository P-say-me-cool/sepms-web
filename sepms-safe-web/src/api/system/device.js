import request from '@/utils/request'

// 查询装置配置列表
export function listDevice(query) {
  return request({
    url: '/system/device/list',
    method: 'get',
    params: query
  })
}

// 查询装置侧线
export function getDeviceLine(query) {
  return request({
    url: '/system/device/line/',
    method: 'get',
    params: query
  })
}

// 查询装置瞬时表
export function getMeterList(id) {
  return request({
    url: '/system/device/'+id,
    method: 'get'
  })
}

// 新增装置配置侧线
export function addDeviceLine(data) {
  return request({
    url: '/system/device',
    method: 'post',
    data: data
  })
}

// 根据侧线ID查仪表
export function sideLineList(id) {
  return request({
    url: '/system/device/sideline/'+id,
    method: 'get'
  })
}

// 新增装置配置侧线
export function addSideAndMeter(data) {
  return request({
    url: '/system/device/sideandmeter',
    method: 'post',
    data: data
  })
}

// 删除
export function deleteSideLineMeter(id) {
  return request({
    url: '/system/device/' + id,
    method: 'delete'
  })
}
