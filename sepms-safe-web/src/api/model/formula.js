import request from '@/utils/request'

// 查询单罐计算列表
export function listFormula(query) {
  return request({
    url: '/model/formula/list',
    method: 'get',
    params: query
  })
}

// 查询单罐计算详细
export function getFormula(id) {
  return request({
    url: '/model/formula/' + id,
    method: 'get'
  })
}

// 新增单罐计算
export function addFormula(data) {
  return request({
    url: '/model/formula',
    method: 'post',
    data: data
  })
}

// 修改单罐计算
export function updateFormula(data) {
  return request({
    url: '/model/formula',
    method: 'put',
    data: data
  })
}

// 删除单罐计算
export function delFormula(id) {
  return request({
    url: '/model/formula/' + id,
    method: 'delete'
  })
}

// 罐区列表
export function areaList() {
  return request({
    url: '/model/formula/areaList',
    method: 'get'
  })
}

// 罐列表
export function tankList(query) {
  return request({
    url: '/model/formula/tankList',
    method: 'get',
    params: query
  })
}

// 罐计量单位获取
export function tankUnitList(query) {
  return request({
    url: '/model/formula/tankUnitList',
    method: 'get',
    params: query
  })
}
