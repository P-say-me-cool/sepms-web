import request from '@/utils/request'

// 查询罐参数配置列表
export function listParameter(query) {
  return request({
    url: '/model/parameter/list',
    method: 'get',
    params: query
  })
}

// 查询罐参数配置详细
export function getParameter(id) {
  return request({
    url: '/model/parameter/' + id,
    method: 'get'
  })
}

// 新增罐参数配置
export function addParameter(data) {
  return request({
    url: '/model/parameter',
    method: 'post',
    data: data
  })
}

// 修改罐参数配置
export function updateParameter(data) {
  return request({
    url: '/model/parameter',
    method: 'put',
    data: data
  })
}

// 删除罐参数配置
export function delParameter(id) {
  return request({
    url: '/model/parameter/' + id,
    method: 'delete'
  })
}
