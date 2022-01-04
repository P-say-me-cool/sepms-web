import request from '@/utils/request'

// 查询互共点仲裁班量列表
export function listArbitrationShiftApi(query) {
  return request({
    url: '/material/arbitrationShift/list',
    method: 'get',
    params: query
  })
}

// 提取
export function extractCalculationApi(query) {
  return request({
    url: '/material/arbitrationShift/calculation',
    method: 'get',
    params: query
  })
}

// 保存
export function arbitrationShiftApi(data) {
  return request({
    url: '/material/arbitrationShift',
    method: 'post',
    data: data
  })
}

// 提交
export function arbitrationShiftSubmitApi(data) {
  return request({
    url: '/material/arbitrationShift/submit',
    method: 'post',
    data: data
  })
}

// 解除提交
export function arbitrationShiftCancelSubmitApi(data) {
  return request({
    url: '/material/arbitrationShift/cancelSubmit',
    method: 'post',
    data: data
  })
}
