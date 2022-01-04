import request from '@/utils/request'

// 查询仪表管理列表
export function listMeter(query) {
  return request({
    url: '/model/meter/list',
    method: 'get',
    params: query
  })
}
// 互供点查询仪表管理列表
export function listToPoint(query) {
  return request({
    url: '/model/meter/listPoint',
    method: 'get',
    params: query
  })
}

export function selectListMeter(query) {
  return request({
    url: '/model/meter/selectList',
    method: 'get',
    params: query
  })
}

// 查询仪表管理详细
export function getMeter(id) {
  return request({
    url: '/model/meter/' + id,
    method: 'get'
  })
}

// 新增仪表管理
export function addMeter(data) {
  return request({
    url: '/model/meter',
    method: 'post',
    data: data
  })
}

// 修改仪表管理
export function updateMeter(data) {
  return request({
    url: '/model/meter',
    method: 'put',
    data: data
  })
}

// 删除仪表管理
export function delMeter(id) {
  return request({
    url: '/model/meter/' + id,
    method: 'delete'
  })
}
