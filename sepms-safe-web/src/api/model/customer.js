import request from '@/utils/request'

// 查询客商管理列表
export function listCustomer(query) {
  return request({
    url: '/model/customer/list',
    method: 'get',
    params: query
  })
}

// 查询客商管理详细
export function getCustomer(id) {
  return request({
    url: '/model/customer/' + id,
    method: 'get'
  })
}

// 新增客商管理
export function addCustomer(data) {
  return request({
    url: '/model/customer',
    method: 'post',
    data: data
  })
}

// 修改客商管理
export function updateCustomer(data) {
  return request({
    url: '/model/customer',
    method: 'put',
    data: data
  })
}

// 删除客商管理
export function delCustomer(id) {
  return request({
    url: '/model/customer/' + id,
    method: 'delete'
  })
}
