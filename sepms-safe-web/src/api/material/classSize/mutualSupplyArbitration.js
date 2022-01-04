import request from '@/utils/request'

// 查询互共点仲裁仪计量列表
export function listMutualSupplyArbitrationApi(query) {
  return request({
    url: '/material/mutualSupplyArbitration/list',
    method: 'get',
    params: query
  })
}

// 自动采数
export function calculationApi(query) {
  return request({
    url: '/material/mutualSupplyArbitration/calculation',
    method: 'get',
    params: query
  })
}

// 保存
export function mutualSupplyArbitrationApi(data) {
  return request({
    url: '/material/mutualSupplyArbitration/add',
    method: 'post',
    data: data
  })
}


// // 刷新
// export function apiRefresh(query) {
//   return request({
//     url: '/material/mutualSupplyInstrumentMetering/Refresh',
//     method: 'get',
//     params: query
//   })
// }
