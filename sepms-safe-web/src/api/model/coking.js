import request from '@/utils/request'


// 查询装置列表
export function listEquipmentCoking(query) {
  return request({
    url: '/model/coking/list',
    method: 'get',
    params: query
  })
}
// 查询装置详细
export function getEquipmentCoking(id) {
  return request({
    url: '/model/coking/' + id,
    method: 'get'
  })
}

