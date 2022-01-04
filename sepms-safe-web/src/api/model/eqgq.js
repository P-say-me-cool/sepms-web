import request from '@/utils/request'

// 查询仓储装置列表
export function listEqgq(query) {
  return request({
    url: '/model/eqgq/list',
    method: 'get',
    params: query
  })
}

// 查询仓储装置详细
export function getEqgq(id) {
  return request({
    url: '/model/eqgq/' + id,
    method: 'get'
  })
}

// 新增仓储装置
export function addEqgq(data) {
  return request({
    url: '/model/eqgq',
    method: 'post',
    data: data
  })
}

// 修改仓储装置
export function updateEqgq(data) {
  return request({
    url: '/model/eqgq',
    method: 'put',
    data: data
  })
}

// 删除仓储装置
export function delEqgq(id) {
  return request({
    url: '/model/eqgq/' + id,
    method: 'delete'
  })
}
