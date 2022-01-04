import request from '@/utils/request'

// 查询平衡项列表
export function listBalanceItem(query) {
  return request({
    url: '/model/balanceItem/list',
    method: 'get',
    params: query
  })
}

// 查询平衡项详细
export function getBalanceItem(id) {
  return request({
    url: '/model/balanceItem/' + id,
    method: 'get'
  })
}

// 新增平衡项
export function addBalanceItem(data) {
  return request({
    url: '/model/balanceItem',
    method: 'post',
    data: data
  })
}

// 修改平衡项
export function updateBalanceItem(data) {
  return request({
    url: '/model/balanceItem',
    method: 'put',
    data: data
  })
}

// 删除平衡项
export function delBalanceItem(id) {
  return request({
    url: '/model/balanceItem/' + id,
    method: 'delete'
  })
}
