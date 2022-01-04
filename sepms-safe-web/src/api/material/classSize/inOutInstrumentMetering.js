import request from '@/utils/request'

// 查询进出厂点仪计量列表
export function listInOutInstrumentMetering(query) {
  return request({
    url: '/material/InOutInstrumentMetering/list',
    method: 'get',
    params: query
  })
}

// 自动采数
export function dataAcquisitionApi(data) {
  return request({
    url: '/material/InOutInstrumentMetering/dataAcquisition1',
    method: 'post',
    data: data
  })
}

// 自动采数 类似刷新
export function dataAcquisitionApis(query) {
  return request({
    url: '/material/InOutInstrumentMetering/dataAcquisition',
    method: 'get',
    params: query
  })
}

// 保存
export function inOutInstrumentMeteringApi(data) {
  return request({
    url: '/material/InOutInstrumentMetering',
    method: 'post',
    data: data
  })
}

// 刷新
export function refreshApi(query) {
  return request({
    url: '/material/InOutInstrumentMetering/Refresh',
    method: 'get',
    params: query
  })
}

// 计算计算净读数
export function recalculateApi(query) {
  return request({
    url: '/material/InOutInstrumentMetering/Recalculate',
    method: 'get',
    params: query
  })
}
