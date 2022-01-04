import request from '@/utils/request'

// 查询化工装置收付列表
export function listPayment(query) {
  return request({
    url: '/material/chemical/payment/list',
    method: 'get',
    params: query
  })
}

// 查询化工装置收付详细
export function getPayment(id) {
  return request({
    url: '/material/chemical/payment/' + id,
    method: 'get'
  })
}

// 新增化工装置收付
export function addPayment(data) {
  return request({
    url: '/material/chemical/payment',
    method: 'post',
    data: data
  })
}

// 修改化工装置收付
export function updatePayment(data) {
  return request({
    url: '/material/chemical/payment',
    method: 'put',
    data: data
  })
}

// 删除化工装置收付
export function delPayment(id) {
  return request({
    url: '/material/chemical/payment/' + id,
    method: 'delete'
  })
}

// 查询侧线列表
export function listPipe(query) {
  return request({
    url: '/model/pipe/listPmPipe',
    method: 'get',
    params: query
  })
}

// 获取进出厂点物料
export function findEquipmentMaterial(query) {
  return request({
    url: '/model/nodematerial/id/',
    method: 'get',
    params: query
  })
}

// 查询源节点
export function listPayees(query) {
  return request({
    url: '/model/payee/payeelist',
    method: 'get',
    params: query
  })
}

