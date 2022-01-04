import request from '@/utils/request'

// 查询园区列表
export function listPark(query) {
  return request({
    url: '/model/park/list',
    method: 'get',
    params: query
  })
}

// 查询园区详细
export function getPark(id) {
  return request({
    url: '/model/park/' + id,
    method: 'get'
  })
}

// 新增园区
export function addPark(data) {
  return request({
    url: '/model/park',
    method: 'post',
    data: data
  })
}

// 修改园区
export function updatePark(data) {
  return request({
    url: '/model/park',
    method: 'put',
    data: data
  })
}

// 删除园区
export function delPark(id) {
  return request({
    url: '/model/park/' + id,
    method: 'delete'
  })
}
