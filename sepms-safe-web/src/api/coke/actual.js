import request from '@/utils/request'

// 查询推焦实际列表
export function listActual(query) {
  return request({
    url: '/coking/coke/actual/list',
    method: 'get',
    params: query
  })
}

// 查询配煤单下的推焦实际
export function getGreaterNearDate(query) {
  return request({
    url: '/coking/coke/actual/getGreaterNearDate',
    method: 'get',
    params: query
  })
}

// 查询推焦实际详细
export function getActual(id) {
  return request({
    url: '/coking/coke/actual/' + id,
    method: 'get'
  })
}

// 新增推焦实际
export function addActual(data) {
  return request({
    url: '/coking/coke/actual',
    method: 'post',
    data: data
  })
}

// 修改推焦实际
export function updateActual(data) {
  return request({
    url: '/coking/coke/actual',
    method: 'put',
    data: data
  })
}

// 删除推焦实际
export function delActual(id) {
  return request({
    url: '/coking/coke/actual/' + id,
    method: 'delete'
  })
}

// 推焦实际数据
export function getStoveNum() {
  return request({
    url: '/coking/coke/actual/getStoveNum',
    method: 'get'
  })
}
