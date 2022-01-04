import request from '@/utils/request'

// 查询仪表计量列表
export function listInstrument(query) {
  return request({
    url: '/material/chemical/instrument/queryList',
    method: 'get',
    params: query
  })
}

// 查询仪表计量详细
export function getInstrument(id) {
  return request({
    url: '/material/chemical/instrument/' + id,
    method: 'get'
  })
}

// 新增仪表计量
export function addInstrument(data) {
  return request({
    url: '/material/chemical/instrument',
    method: 'post',
    data: data
  })
}

// 修改仪表计量
export function updateInstrument(data) {
  return request({
    url: '/material/chemical/instrument',
    method: 'put',
    data: data
  })
}

// 删除仪表计量
export function delInstrument(id) {
  return request({
    url: '/material/chemical/instrument/' + id,
    method: 'delete'
  })
}

// 获取后读数、净读数列表
export function getReadNumList(data) {
  return request({
    url: '/material/chemical/instrument/getReadNumList',
    method: 'post',
    data: data
  })
}

// 获取净读数列表
export function getNetNumList(data) {
  return request({
    url: '/material/chemical/instrument/getNetNumList',
    method: 'post',
    data: data
  })
}


// 批量保存
export function batchSave(data) {
  return request({
    url: '/material/chemical/instrument/batchSave',
    method: 'post',
    data: data
  })
}

// 批量修改
export function batchUpdate(data) {
  return request({
    url: '/material/chemical/instrument/batchUpdate',
    method: 'post',
    data: data
  })
}

// 查询仪表计量从表信息
export function getDetail(id) {
  return request({
    url: '/material/chemical/instrument/getDetail/' + id,
    method: 'get'
  })
}

// 查询侧线列表
export function listPmPipe(data) {
  return request({
    url: '/model/pipe/list',
    method: 'get',
    data: data
  })
}

// 查询侧线详细
export function getPipe(id) {
  return request({
    url: '/model/pipe/page/' + id,
    method: 'get'
  })
}

// 查询节点管理详细
export function getNodeIdByMeterIds(query) {
  return request({
    url: '/model/nodemeter/getNodeIdByMeterIds',
    method: 'get',
    params: query
  })
}

// 查询节点物料侧线下的物料
export function listPipeMaterial(query) {
  return request({
    url: '/model/nodematerial/querymaterial',
    method: 'get',
    params: query
  })
}

// 删除从表信息
export function deleteDetail(id) {
  return request({
    url: '/material/chemical/instrument/detail/' + id,
    method: 'delete'
  })
}

// 从表批量保存
export function batchDetailSave(data) {
  return request({
    url: '/material/chemical/instrument/batchDetailSave',
    method: 'post',
    data: data
  })
}

// 获取前读数列表
export function getBeforeNumList(data) {
  return request({
    url: '/material/chemical/instrument/getBeforeNumList',
    method: 'post',
    data: data
  })
}
