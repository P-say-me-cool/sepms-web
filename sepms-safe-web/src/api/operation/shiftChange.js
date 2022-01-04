import request from '@/utils/request'

// 查询交接班管理列表
export function listShiftChange(query) {
  return request({
    url: '/operation/shiftChange/list',
    method: 'get',
    params: query
  })
}
// 查询上一班
export function getShiftChangeBeforeInfo(query) {
  return request({
    url: '/operation/shiftChange/getBeforeInfo',
    method: 'get',
    params: query
  })
}

// 查询下一班
export function getNextInfo(query) {
  return request({
    url: '/operation/shiftChange/getNextInfo',
    method: 'get',
    params: query
  })
}
// 查询交接班管理详细
export function getShiftChange(id) {
  return request({
    url: '/operation/shiftChange/' + id,
    method: 'get'
  })
}

// 新增交接班管理
export function addShiftChange(data) {
  return request({
    url: '/operation/shiftChange',
    method: 'post',
    data: data
  })
}

// 修改交接班管理
export function updateShiftChange(data) {
  return request({
    url: '/operation/shiftChange/shift',
    method: 'put',
    data: data
  })
}

// 修改交接班管理
export function changeShiftChange(data) {
  return request({
    url: '/operation/shiftChange/change',
    method: 'put',
    data: data
  })
}

// 删除交接班管理
export function delShiftChange(id) {
  return request({
    url: '/operation/shiftChange/' + id,
    method: 'delete'
  })
}
