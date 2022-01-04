import request from '@/utils/request'

// 查询能源管网列表
export function listEnergyNetwork(query) {
  return request({
    url: '/model/energyNetwork/list',
    method: 'get',
    params: query
  })
}

// 查询能源管网详细
export function getEnergyNetwork(id) {
  return request({
    url: '/model/energyNetwork/' + id,
    method: 'get'
  })
}

// 新增能源管网
export function addEnergyNetwork(data) {
  return request({
    url: '/model/energyNetwork',
    method: 'post',
    data: data
  })
}

// 修改能源管网
export function updateEnergyNetwork(data) {
  return request({
    url: '/model/energyNetwork',
    method: 'put',
    data: data
  })
}

// 删除能源管网
export function delEnergyNetwork(id) {
  return request({
    url: '/model/energyNetwork/' + id,
    method: 'delete'
  })
}
