import request from '@/utils/request'

// 查询节点管理列表
export function listNode(query) {
  return request({
    url: '/model/node/list',
    method: 'get',
    params: query
  })
}

// 查询节点管理详细
export function getNode(id) {
  return request({
    url: '/model/node/' + id,
    method: 'get'
  })
}

// 新增节点管理
export function addNode(data) {
  return request({
    url: '/model/node',
    method: 'post',
    data: data
  })
}

// 修改节点管理
export function updateNode(data) {
  return request({
    url: '/model/node',
    method: 'put',
    data: data
  })
}

// 删除节点管理
export function delNode(id) {
  return request({
    url: '/model/node/' + id,
    method: 'delete'
  })
}
