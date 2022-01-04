import request from '@/utils/request'

// 查询汇流点维护列表
export function listConfluPoint(query) {
  return request({
    url: '/model/confluPoint/list',
    method: 'get',
    params: query
  })
}

// 查询汇流点维护详细
export function getConfluPoint(id) {
  return request({
    url: '/model/confluPoint/' + id,
    method: 'get'
  })
}

// 新增汇流点维护
export function addConfluPoint(data) {
  return request({
    url: '/model/confluPoint',
    method: 'post',
    data: data
  })
}

// 修改汇流点维护
export function updateConfluPoint(data) {
  return request({
    url: '/model/confluPoint',
    method: 'put',
    data: data
  })
}

// 删除汇流点维护
export function delConfluPoint(id) {
  return request({
    url: '/model/confluPoint/' + id,
    method: 'delete'
  })
}
