import request from '@/utils/request'

// 查询节点管理详细
export function listFactorys() {
  return request({
    url: '/model/nodemeter/factorylist',
    method: 'get'
  })
}

// 查询节点管理列表
export function listNode(query) {
  return request({
    url: '/model/nodemeter/nodelist',
    method: 'get',
    params: query
  })
}

// 查询节点管理详细
export function listMeter(query) {
  return request({
    url: '/model/nodemeter/meterlist',
    method: 'get',
    params: query
  })
}

// 查询节点管理详细
export function queryMeterByNodeId(query) {
  return request({
    url: '/model/nodemeter/querybynodeid',
    method: 'get',
    params: query
  })
}

// 新增节点管理
export function insertNodeAndMeter(data) {
  return request({
    url: '/model/nodemeter',
    method: 'post',
    data: data
  })
}

// 删除节点管理
export function delNodeMeter(id) {
  return request({
    url: '/model/nodemeter/' + id,
    method: 'delete'
  })
}
