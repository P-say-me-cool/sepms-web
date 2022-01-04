import request from '@/utils/request'

// 查询位号列表
export function listTagnumber(query) {
  return request({
    url: '/model/number/list',
    method: 'get',
    params: query
  })
}

// 查询位号列表
export function getHisValueByTagNumber(query) {
  return request({
    url: '/model/number/getHisValueByTagNumber',
    method: 'get',
    params: query
  })
}

// 查询位号列表
export function getCharByTagNumber(query) {
  return request({
    url: '/model/number/getCharByTagNumber',
    method: 'get',
    params: query
  })
}

// 查询位号详细
export function getTagnumber(id) {
  return request({
    url: '/model/number/' + id,
    method: 'get'
  })
}

// 新增位号
export function addTagnumber(data) {
  return request({
    url: '/model/number',
    method: 'post',
    data: data
  })
}

// 修改位号
export function updateTagnumber(data) {
  return request({
    url: '/model/number',
    method: 'put',
    data: data
  })
}

// 删除位号
export function delTagnumber(id) {
  return request({
    url: '/model/number/' + id,
    method: 'delete'
  })
}
