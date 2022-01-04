import request from '@/utils/request'

// 查询运行参数列表
export function listOperationParam(query) {
  return request({
    url: '/model/operationParam/list',
    method: 'get',
    params: query
  })
}

// 查询运行参数详细
export function getOperationParam(id) {
  return request({
    url: '/model/operationParam/' + id,
    method: 'get'
  })
}

// 新增运行参数
export function addOperationParam(data) {
  return request({
    url: '/model/operationParam',
    method: 'post',
    data: data
  })
}

// 修改运行参数
export function updateOperationParam(data) {
  return request({
    url: '/model/operationParam',
    method: 'put',
    data: data
  })
}

// 删除运行参数
export function delOperationParam(id) {
  return request({
    url: '/model/operationParam/' + id,
    method: 'delete'
  })
}
