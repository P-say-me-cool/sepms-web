import request from '@/utils/request'

// 查询焦炉装置列表
export function listEqjl(query) {
  return request({
    url: '/model/eqjl/list',
    method: 'get',
    params: query
  })
}

// 查询焦炉装置详细
export function getEqjl(id) {
  return request({
    url: '/model/eqjl/' + id,
    method: 'get'
  })
}

// 新增焦炉装置
export function addEqjl(data) {
  return request({
    url: '/model/eqjl',
    method: 'post',
    data: data
  })
}

// 修改焦炉装置
export function updateEqjl(data) {
  return request({
    url: '/model/eqjl',
    method: 'put',
    data: data
  })
}

// 删除焦炉装置
export function delEqjl(id) {
  return request({
    url: '/model/eqjl/' + id,
    method: 'delete'
  })
}
