import request from '@/utils/request'

// 查询节点管理列表
export function listNode(query) {
  return request({
    url: '/model/nodematerial/nodelist',
    method: 'get',
    params: query
  })
}

// 查询节点管理详细
export function listMaterial(query) {
  return request({
    url: '/model/nodematerial/materiallist',
    method: 'get',
    params: query
  })
}

// 查询节点管理详细
export function queryMaterialByNodeId(query) {
  return request({
    url: '/model/nodematerial/querymaterial',
    method: 'get',
    params: query
  })
}

// 新增节点管理
export function insertNodeAndMaterial(data) {
  return request({
    url: '/model/nodematerial',
    method: 'post',
    data: data
  })
}

// 删除节点管理
export function delNodeMaterial(id) {
  return request({
    url: '/model/nodematerial/' + id,
    method: 'delete'
  })
}
