import request from '@/utils/request'

// 查询平衡列表
export function listBalanceMeter(query) {
  return request({
    url: '/model/balanceMeter/list',
    method: 'get',
    params: query
  })
}

// 查询平衡详细
export function getBalanceMeter(id) {
  return request({
    url: '/model/balanceMeter/' + id,
    method: 'get'
  })
}

// 新增平衡
export function addBalanceMeter(data) {
  return request({
    url: '/model/balanceMeter',
    method: 'post',
    data: data
  })
}

// 修改平衡
export function updateBalanceMeter(data) {
  return request({
    url: '/model/balanceMeter',
    method: 'put',
    data: data
  })
}

// 删除平衡
export function delBalanceMeter(id) {
  return request({
    url: '/model/balanceMeter/' + id,
    method: 'delete'
  })
}
// 查询平衡表平衡项
export function getBalanceMeterItem(id) {
  return request({
    url: '/model/balanceMeter/getBalanceMeterItem/' + id,
    method: 'get'
  })
}
// 修改平衡
export function addBalanceMeterItem(data) {
  return request({
    url: '/model/balanceMeter/addBalanceMeterItem',
    method: 'post',
    data: data
  })
}
