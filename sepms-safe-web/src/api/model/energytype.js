import request from '@/utils/request'

// 查询能源类型列表
export function listEnergytype(query) {
  return request({
    url: '/model/energytype/list',
    method: 'get',
    params: query
  })
}

// 查询能源类型详细
export function getEnergytype(id) {
  return request({
    url: '/model/energytype/' + id,
    method: 'get'
  })
}

// 新增能源类型
export function addEnergytype(data) {
  return request({
    url: '/model/energytype',
    method: 'post',
    data: data
  })
}

// 修改能源类型
export function updateEnergytype(data) {
  return request({
    url: '/model/energytype',
    method: 'put',
    data: data
  })
}

// 删除能源类型
export function delEnergytype(id) {
  return request({
    url: '/model/energytype/' + id,
    method: 'delete'
  })
}
