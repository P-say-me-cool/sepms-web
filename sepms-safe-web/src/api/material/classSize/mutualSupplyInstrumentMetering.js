import request from '@/utils/request'

// 查询互共厂点仪计量列表
export function listMutualSupplyInstrumentMeteringApi(query) {
  return request({
    url: '/material/mutualSupplyInstrumentMetering/list',
    method: 'get',
    params: query
  })
}
// 自动采数
export function dataAcquisitionApi(query) {
  return request({
    url: '/material/mutualSupplyInstrumentMetering/dataAcquisition',
    method: 'get',
    params: query
  })
}

// 刷新
export function apiRefresh(query) {
  return request({
    url: '/material/mutualSupplyInstrumentMetering/Refresh',
    method: 'get',
    params: query
  })
}
// 保存互共点工厂仪表计量
export function addMutualSupplyInstrumentMeteringApi(data) {
  return request({
    url: '/material/mutualSupplyInstrumentMetering/add',
    method: 'post',
    data: data
  })
}
