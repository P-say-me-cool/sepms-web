import request from '@/utils/request'

// 查询装置运行状态列表
export function listStatus(query) {
  return request({
    url: '/system/devicestatus/list',
    method: 'get',
    params: query
  })
}

// 查询装置运行状态详细
export function getStatus(id) {
  return request({
    url: '/system/devicestatus/' + id,
    method: 'get'
  })
}

// 新增装置运行状态
export function addStatus(data) {
  return request({
    url: '/system/devicestatus',
    method: 'post',
    data: data
  })
}

// 修改装置运行状态
export function updateStatus(data) {
  return request({
    url: '/system/devicestatus',
    method: 'put',
    data: data
  })
}

// 删除装置运行状态
export function delStatus(id) {
  return request({
    url: '/system/devicestatus/' + id,
    method: 'delete'
  })
}
