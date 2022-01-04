import request from '@/utils/request'

// 查询罐收付列表
export function listPayment(query) {
  return request({
    url: '/material/payment/list',
    method: 'get',
    params: query
  })
}

// 查询测线下的物料
export function getPipeMaterial(query) {
  return request({
    url: '/material/payment/getPipeMaterial',
    method: 'get',
    params: query
  })
}

// 查询罐初始化的物料
export function getMaterialBynodeId(query) {
  return request({
    url: '/model/nodematerial/getMaterialBynodeId',
    method: 'get',
    params: query
  })
}

// 查询罐收付详细
export function getPayment(id) {
  return request({
    url: '/material/payment/' + id,
    method: 'get'
  })
}

// 新增罐收付
export function addPayment(data) {
  return request({
    url: '/material/payment',
    method: 'post',
    data: data
  })
}

// 修改罐收付
export function updatePayment(data) {
  return request({
    url: '/material/payment',
    method: 'put',
    data: data
  })
}

// 关闭罐收付
export function closePotReceiptPayment(data) {
  return request({
    url: '/material/payment/closePotReceiptPayment',
    method: 'put',
    data: data
  })
}

// 删除罐收付
export function delPayment(id) {
  return request({
    url: '/material/payment/' + id,
    method: 'delete'
  })
}
