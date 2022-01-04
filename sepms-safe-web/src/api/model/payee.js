import request from '@/utils/request'

// 查询源节点
export function listPayees(query) {
  return request({
    url: '/model/payee/payeelist',
    method: 'get',
    params: query
  })
}

// 查询节点关系
export function queryRelation(query) {
  return request({
    url: '/model/payee/api/payrelation',
    method: 'get',
    params: query
  })
}

// 新增节点管理
export function insertObjective(data) {
  return request({
    url: '/model/payee',
    method: 'post',
    data: data
  })
}

// 删除节点管理
export function delSource(id) {
  return request({
    url: '/model/payee/' + id,
    method: 'delete'
  })
}
