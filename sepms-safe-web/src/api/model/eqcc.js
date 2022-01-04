import request from '@/utils/request'

// 查询仓储装置列表
export function listEqcc(query) {
  return request({
    url: '/model/eqcc/list',
    method: 'get',
    params: query
  })
}

// 查询仓储装置详细
export function getEqcc(id) {
  return request({
    url: '/model/eqcc/' + id,
    method: 'get'
  })
}

// 新增仓储装置
export function addEqcc(data) {
  return request({
    url: '/model/eqcc',
    method: 'post',
    data: data
  })
}

// 修改仓储装置
export function updateEqcc(data) {
  return request({
    url: '/model/eqcc',
    method: 'put',
    data: data
  })
}

// 删除仓储装置
export function delEqcc(id) {
  return request({
    url: '/model/eqcc/' + id,
    method: 'delete'
  })
}
