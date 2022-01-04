import request from '@/utils/request'

// 查询进出厂点班量列表
export function listInOutShiftMeteringApi(query) {
  return request({
    url: '/material/inOutShiftMetering/list',
    method: 'get',
    params: query
  })
}

// 提取班量数据
export function calculationApi(query) {
  return request({
    url: '/material/inOutShiftMetering/calculation',
    method: 'get',
    params: query
  })
}
// 保存进出厂点班量
export function addInOutShiftMeteringApi(data) {
  return request({
    url: '/material/inOutShiftMetering',
    method: 'post',
    data: data
  })
}
// 提交
export function submitApi(data) {
  return request({
    url: '/material/inOutShiftMetering/submit',
    method: 'post',
    data: data
  })
}

// 解除提交
export function cancelSubmitApi(data) {
  return request({
    url: '/material/inOutShiftMetering/cancelSubmit',
    method: 'post',
    data: data
  })
}
// 班次
export function inOutShiftApi(query) {
  return request({
    url: '/material/ClassSizeController/inOutShift',
    method: 'get',
    params: query
  })
}
