import request from '@/utils/request'

// 查询界区列表
export function listArea(query) {
  return request({
    url: '/model/area/list',
    method: 'get',
    params: query
  })
}

// 查询界区详细
export function getArea(id) {
  return request({
    url: '/model/area/' + id,
    method: 'get'
  })
}

// 新增界区
export function addArea(data) {
  return request({
    url: '/model/area',
    method: 'post',
    data: data
  })
}

// 修改界区
export function updateArea(data) {
  return request({
    url: '/model/area',
    method: 'put',
    data: data
  })
}

// 删除界区
export function delArea(id) {
  return request({
    url: '/model/area/' + id,
    method: 'delete'
  })
}
