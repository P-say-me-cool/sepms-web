import request from '@/utils/request'

// 查询接令组配置列表
export function listConfig(query) {
  return request({
    url: '/system/receiveGroupConfig/list',
    method: 'get',
    params: query
  })
}

export function selectListByNickName(query) {
  return request({
    url: '/system/receiveGroupConfig/selectListByNickName',
    method: 'get',
    params: query
  })
}

// 查询接令组配置详细
export function getConfig(id) {
  return request({
    url: '/system/receiveGroupConfig/' + id,
    method: 'get'
  })
}

// 查询接令组配置人员
export function getReceiveGroupUser(psReceiveGroupConfigId) {
  return request({
    url: '/system/receiveGroupConfig/getReceiveGroupUser/'+psReceiveGroupConfigId,
    method: 'get'
  })
}

// 新增接令组配置
export function addConfig(data) {
  return request({
    url: '/system/receiveGroupConfig',
    method: 'post',
    data: data
  })
}

// 新增接令组配置
export function addReceiveUsers(data) {
  return request({
    url: '/system/receiveGroupConfig/addReceiveUsers',
    method: 'post',
    data: data
  })
}

// 修改接令组配置
export function updateConfig(data) {
  return request({
    url: '/system/receiveGroupConfig',
    method: 'put',
    data: data
  })
}

// 删除接令组配置
export function delConfig(id) {
  return request({
    url: '/system/receiveGroupConfig/' + id,
    method: 'delete'
  })
}

// 删除接令组配置
export function deleteReceiveGroupConfigUserById(id) {
  return request({
    url: '/system/receiveGroupConfig/deleteReceiveGroupConfigUserById/' + id,
    method: 'delete'
  })
}

// 删除接令组配置
export function deleteReceiveGroupConfigById(id) {
  return request({
    url: '/system/receiveGroupConfig/deleteReceiveGroupConfigById/' + id,
    method: 'delete'
  })
}
