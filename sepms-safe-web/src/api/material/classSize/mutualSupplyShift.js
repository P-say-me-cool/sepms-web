import request from '@/utils/request'

// 查询互共点工厂班量列表
export function listMutualSupplyShiftApi(query) {
  return request({
    url: '/material/mutualSupplyShift/list',
    method: 'get',
    params: query
  })
}
// 自动采数
export function calculationApi(query) {
  return request({
    url: '/material/mutualSupplyShift/calculation',
    method: 'get',
    params: query
  })
}
// 保存互共点班量
export function mutualSupplyShiftApi(data) {
  return request({
    url: '/material/mutualSupplyShift',
    method: 'post',
    data: data
  })
}
