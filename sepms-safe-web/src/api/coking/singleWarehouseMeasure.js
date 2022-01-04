import request from '@/utils/request'

// 查询单仓测量列表
export function listSingleWarehouseMeasure(query) {
  return request({
    url: '/coking/SingleWarehouseMeasure/list',
    method: 'get',
    params: query
  })
}

// 获取时次（下拉列表）
export function getShiftVoApi() {
  return request({
    url: '/coking/SingleWarehouseMeasure/getShiftVo',
    method: 'get',
  })
}

// 获取配煤区域（下拉列表）
export function getBlendCoalAreaVoApi() {
  return request({
    url: '/coking/SingleWarehouseMeasure/getBlendCoalAreaVo',
    method: 'get',
  })
}
//保存
export function saveSingeWarehouseMeasureApi(data) {
  return request({
    url: '/coking/SingleWarehouseMeasure/saveSingeWarehouseMeasure',
    method: 'post',
    data: data
  })
}

// 计算平均高度
export function getAvgTopHeigtApi(query) {
  return request({
    url: '/coking/SingleWarehouseMeasure/getAvgTopHeigt',
    method: 'get',
    params: query
  })
}



// 计算单仓库存
export function calculationSingleWarehouseCapacityApi(query) {
  return request({
    url: '/coking/SingleWarehouseMeasure/calculationSingleWarehouseCapacity',
    method: 'get',
    params: query
  })
}
// 提交
export function singleWarehouseMeasureSubmitApi(data) {
  return request({
    url: '/coking/SingleWarehouseMeasure/submit',
    method: 'post',
    data: data
  })
}

// 解除提交
export function singleWarehouseMeasureCancelSubmitApi(data) {
  return request({
    url: '/coking/SingleWarehouseMeasure/cancelSubmit',
    method: 'post',
    data: data
  })
}



