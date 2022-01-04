import request from '@/utils/request'

// 查询装置组配置列表
export function listDevicegroup(query) {
  return request({
    url: '/system/devicegroup/list',
    method: 'get',
    params: query
  })
}

// 查询装置组配置详细
export function getDevicegroup(id) {
  return request({
    url: '/system/devicegroup/' + id,
    method: 'get'
  })
}

// 新增装置组配置
export function addDevicegroup(data) {
  return request({
    url: '/system/devicegroup/addDeviceGroup',
    method: 'post',
    data: data
  })
}

// 修改装置组配置
export function updateDevicegroup(data) {
  return request({
    url: '/system/devicegroup',
    method: 'put',
    data: data
  })
}

// 删除装置组配置
export function delDevicegroup(id) {
  return request({
    url: '/system/devicegroup/' + id,
    method: 'delete'
  })
}

// 添加装置组配置
export function addDevices(data) {
  return request({
    url: '/system/devicegroup/addDevices',
    method: 'post',
    data: data
  })
}

export function getDeviceByGroupId(id) {
  return request({
    url: '/system/devicegroup/groupId/' + id,
    method: 'get'
  })
}
