import request from '@/utils/request'

// 查询料仓计量主列表
export function listMeasurement(query) {
  return request({
    url: '/material/chemical/measurement/list',
    method: 'get',
    params: query
  })
}

// 查询料仓计量列表
export function queryMeasurementList(query) {
  return request({
    url: '/material/chemical/measurement/queryMeasurementList',
    method: 'get',
    params: query
  })
}

// 查询料仓计量主详细
export function getMeasurement(id) {
  return request({
    url: '/material/chemical/measurement/' + id,
    method: 'get'
  })
}

// 新增料仓计量主
export function addMeasurement(data) {
  return request({
    url: '/material/chemical/measurement',
    method: 'post',
    data: data
  })
}

// 修改料仓计量主
export function updateMeasurement(data) {
  return request({
    url: '/material/chemical/measurement',
    method: 'put',
    data: data
  })
}

// 删除料仓计量主
export function delMeasurement(id) {
  return request({
    url: '/material/chemical/measurement/' + id,
    method: 'delete'
  })
}

// 删除料仓计量从
export function removeDetail(id) {
  return request({
    url: '/material/chemical/measurement/detail/' + id,
    method: 'delete'
  })
}

// 计算
export function batchStockCalculate(data) {
  return request({
    url: '/material/chemical/measurement/batchStockCalculate/' ,
    method: 'post',
    data:data
  })
}

// 数采
export function batchNumberOfMining(data) {
  return request({
    url: '/material/chemical/measurement/batchNumberOfMining/',
    method: 'post',
    data:data
  })
}

// 查询节点下的物料
export function listNodeMaterial(data) {
  return request({
    url: '/model/nodematerial/querymaterial',
    method: 'get',
    params: data
  })
}
