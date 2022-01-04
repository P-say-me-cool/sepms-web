import request from '@/utils/request'

// 信息列表
export function listEqCtrl(query) {
  return request({
    url: '/operation/equipmentCtrl/list',
    method: 'get',
    params: query
  })
}

export function listThird(indId) {
  return request({
    url: '/operation/equipmentCtrl/' + indId,
    method: 'get'
  })
}
