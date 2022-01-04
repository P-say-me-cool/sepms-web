import request from '@/utils/request'

// 班次（下拉列表）x 三班三倒
export function listClassApi() {
  return request({
    url: '/model/classes/listClass',
    method: 'get',
  })
}
// 获取煤种  下拉框 x
export function coalSpaceSelectQueryTypeApi(query) {
  return request({
    url: '/model/materialinfo/queryType',
    method: 'get',
    params:query,
  })
}
// 根据供应商名称搜索 供应商 列表 X
export function listCustomerApi(query) {
  return request({
    url: '/model/customer/listCustomer',
    method: 'get',
    params:query,
  })
}

// 查询用户班次列表
export function listClassByType(query) {
  return request({
    url: '/model/classes/listClassByType',
    method: 'get',
    params: query
  })
}

// 查询炉孔配置列表
export function listConfigureAll(query) {
  return request({
    url: '/model/configure/listAll',
    method: 'get',
    params: query
  })
}
