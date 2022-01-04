import request from '@/utils/request'

// 查询模型树列表
export function listInfo(query) {
  return request({
    url: '/system/info/list',
    method: 'get',
    params: query
  })
}

// 查询模型树详细
export function getInfo(id) {
  return request({
    url: '/system/info/' + id,
    method: 'get'
  })
}

// 新增模型树
export function addInfo(data) {
  return request({
    url: '/system/info',
    method: 'post',
    data: data
  })
}

// 修改模型树
export function updateInfo(data) {
  return request({
    url: '/system/info',
    method: 'put',
    data: data
  })
}

// 删除模型树
export function delInfo(id) {
  return request({
    url: '/system/info/' + id,
    method: 'delete'
  })
}
