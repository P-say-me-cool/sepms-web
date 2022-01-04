import request from '@/utils/request'

// 查询模型树列表
export function listModeltree(query) {
  return request({
    url: '/model/modeltree/list',
    method: 'get',
    params: query
  })
}

// 查询模型树列表
export function selectListModeltree(query) {
  return request({
    url: '/model/modeltree/selectList',
    method: 'get',
    params: query
  })
}
// 查询模型树列表
export function getModelDict(query) {
  return request({
    url: '/model/modeltree/getModelDict',
    method: 'get',
    params: query
  })
}
export function getModelDictBySubType(query) {
  return request({
    url: '/model/modeltree/getModelDictBySubType',
    method: 'get',
    params: query
  })
}
// 根据工厂机构id查询上下层级节点
export function getModelDictById(query) {
  return request({
    url: '/model/modeltree/getModelDictById',
    method: 'get',
    params: query
  })
}

// 根据工厂机构id查询上下层级节点
export function getParentModelByStep(query) {
  return request({
    url: '/model/modeltree/getParentModelByStep',
    method: 'get',
    params: query
  })
}

export function teamListModeltree(query) {
  return request({
    url: '/model/modeltree/teamList',
    method: 'get',
    params: query
  })
}

// 查询模型树详细
export function getModeltree(query) {
  return request({
    url: '/model/modeltree/relateQuery',
    method: 'get',
    params: query
  })
}

// 查询模型树详细
export function getModelDetail(id) {
  return request({
    url: '/model/modeltree/detail?id='+id,
    method: 'get'
  })
}

// 新增模型树
export function addModeltree(data) {
  return request({
    url: '/model/modeltree',
    method: 'post',
    data: data
  })
}

// 修改模型树
export function updateModeltree(data) {
  return request({
    url: '/model/modeltree',
    method: 'put',
    data: data
  })
}

// 删除模型树
export function delModeltree(id) {
  return request({
    url: '/model/modeltree/' + id,
    method: 'delete'
  })
}
// 删除模型树
export function delModeltreeById(data) {
  return request({
    url: '/model/modeltree/deleteRelate',
    method: 'post',
    data: data
  })
}

export function getNextCode(query) {
  return request({
    url: '/model/modeltree/getNextCode',
    method: 'get',
    params: query
  })
}
