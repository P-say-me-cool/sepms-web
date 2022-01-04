import request from '@/utils/request'

// 查询化工装置列表
export function listEqhg(query) {
  return request({
    url: '/model/eqhg/list',
    method: 'get',
    params: query
  })
}

// 查询化工装置详细
export function getEqhg(id) {
  return request({
    url: '/model/eqhg/' + id,
    method: 'get'
  })
}

// 新增化工装置
export function addEqhg(data) {
  return request({
    url: '/model/eqhg',
    method: 'post',
    data: data
  })
}

// 修改化工装置
export function updateEqhg(data) {
  return request({
    url: '/model/eqhg',
    method: 'put',
    data: data
  })
}

// 删除化工装置
export function delEqhg(id) {
  return request({
    url: '/model/eqhg/' + id,
    method: 'delete'
  })
}
