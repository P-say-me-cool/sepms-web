import request from '@/utils/request'

// 查询排班计划列表
export function listShiftsPlan(query) {
  return request({
    url: '/model/shiftsPlan/list',
    method: 'get',
    params: query
  })
}

// 查询排班计划详细
export function getShiftsPlan(id) {
  return request({
    url: '/model/shiftsPlan/' + id,
    method: 'get'
  })
}

// 新增排班计划
export function addShiftsPlan(data) {
  return request({
    url: '/model/shiftsPlan/addShiftsPlan',
    method: 'post',
    data: data
  })
}

// 修改排班计划
export function updateShiftsPlan(data) {
  return request({
    url: '/model/shiftsPlan',
    method: 'put',
    data: data
  })
}

// 删除排班计划
export function delShiftsPlan(id) {
  return request({
    url: '/model/shiftsPlan/' + id,
    method: 'delete'
  })
}

// 查询排班计划列表
export function getShiftsPlanQuery(query) {
  return request({
    url: '/model/shiftsPlan/getShiftsPlan',
    method: 'get',
    params: query
  })
}

// 查询排班计划列表
export function getShiftsPlanByGroupId(query) {
  return request({
    url: '/model/shiftsPlan/getShiftsPlanByGroupId',
    method: 'get',
    params: query
  })
}

export function editsShiftsPlan(query) {
  return request({
    url: '/model/shiftsPlan/editsShiftsPlan',
    method: 'get',
    params: query
  })
}

export function getShiftsPerson(query) {
  return request({
    url: '/model/shiftsPlan/getShiftsPerson',
    method: 'get',
    params: query
  })
}
