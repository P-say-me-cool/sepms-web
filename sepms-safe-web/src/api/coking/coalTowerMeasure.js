import request from '@/utils/request'

// 查询煤塔测量列表
export function coalTowerMeasureApi(query) {
  return request({
    url: '/coking/CoalTowerMeasure/list',
    method: 'get',
    params: query
  })
}

//保存
export function saveCoalTowerMeasureApi(data) {
  return request({
    url: '/coking/CoalTowerMeasure/saveCoalTowerMeasure',
    method: 'post',
    data: data
  })
}

// 班次
export function getShiftApi(query) {
  return request({
    url: '/coking/CoalTowerMeasure/getShift',
    method: 'get',
    params: query
  })
}

// 计算煤塔容量
export function calculationCoalTowerCapacityApi(query) {
  return request({
    url: '/coking/CoalTowerMeasure/calculationCoalTowerCapacity',
    method: 'get',
    params: query
  })
}
// 提交
export function coalTowerMeasureSubmitApi(data) {
  return request({
    url: '/coking/CoalTowerMeasure/submit',
    method: 'post',
    data: data
  })
}

// 解除提交
export function coalTowerMeasureCancelSubmitApi(data) {
  return request({
    url: '/coking/CoalTowerMeasure/cancelSubmit',
    method: 'post',
    data: data
  })
}

