import request from '@/utils/request'

// 根据日期 班次 工厂查询互供点状态信息
export function mutualListApi(query) {
  return request({
    url: '/material/submissionStatus/mutualStatusList/',
    method: 'get',
    params: query
  })
}

// 根据日期 班次 工厂查询罐状态信息
export function potListApi(query) {
  return request({
    url: '/material/submissionStatus/potStatusList/',
    method: 'get',
    params: query
  })
}

//根据日期 班次 工厂查询装置状态信息
export function deviceListApi(query){
  return request({
    url:'/material/submissionStatus/deviceStatusList/',
    method:'get',
    params:query
  })
}

//根据日期 班次 工厂查询进出厂状态信息
export function inOutListApi(query){
  return request({
    url:'/material/submissionStatus/inoutStatusList/',
    method:'get',
    params:query
  })
}

// 原料煤入库
export function coalInWarehouseApi(query) {
  return request({
    url: '/material/submissionStatus/coalInWarehouseStatusList/',
    method: 'get',
    params: query
  })
}


// 原料煤出库
export function coalDeliveryApi(query) {
  return request({
    url: '/material/submissionStatus/coalDeliveryStatusList/',
    method: 'get',
    params: query
  })
}

//煤堆盘库
export function coalHeapInventoryApi(query) {
  return request({
    url: '/material/submissionStatus/CoalHeapInventoryStatusList/',
    method: 'get',
    params: query
  })
}

//单仓测量
export function singleWarehouseApi(query) {
  return request({
    url: '/material/submissionStatus/SingleWarehouseStatusList/',
    method: 'get',
    params: query
  })
}

//煤塔测量
export function coalTowerMeasureApi(query) {
  return request({
    url: '/material/submissionStatus/CoalTowerMeasureStatusList/',
    method: 'get',
    params: query
  })
}

//配煤班消耗
export function coalBlendClassApi(query) {
  return request({
    url: '/material/submissionStatus/CoalBlendClassStatusList/',
    method: 'get',
    params: query
  })
}

//焦仓测量
export function cokeMeasureApi(query) {
  return request({
    url: '/material/submissionStatus/CokeMeasureStatusList/',
    method: 'get',
    params: query
  })
}

//焦场盘库
export function cokeInventoryApi(query) {
  return request({
    url: '/material/submissionStatus/CokeInventoryStatusList/',
    method: 'get',
    params: query
  })
}








