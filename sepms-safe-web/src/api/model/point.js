import request from '@/utils/request'

// 查询互供点维护列表
export function listPoint(query) {
  return request({
    url: '/model/point/list',
    method: 'get',
    params: query
  })
}

export function selectListPoint(query) {
  return request({
    url: '/model/point/selectList',
    method: 'get',
    params: query
  })
}

// 查询互供点维护详细
export function getPoint(id) {
  return request({
    url: '/model/point/' + id,
    method: 'get'
  })
}

// 新增互供点维护
export function addPoint(data) {
  return request({
    url: '/model/point',
    method: 'post',
    data: data
  })
}

// 修改互供点维护
export function updatePoint(data) {
  return request({
    url: '/model/point',
    method: 'put',
    data: data
  })
}

// 删除互供点维护
export function delPoint(id) {
  return request({
    url: '/model/point/' + id,
    method: 'delete'
  })
}
