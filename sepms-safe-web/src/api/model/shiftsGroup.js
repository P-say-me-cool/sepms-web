import request from '@/utils/request'

// 查询轮班组列表
export function listShiftsGroup(query) {
  return request({
    url: '/model/shiftsGroup/list',
    method: 'get',
    params: query
  })
}

// 查询轮班组详细
export function getShiftsGroup(id) {
  return request({
    url: '/model/shiftsGroup/' + id,
    method: 'get'
  })
}

// 新增轮班组
export function addShiftsGroup(data) {
  return request({
    url: '/model/shiftsGroup',
    method: 'post',
    data: data
  })
}

// 修改轮班组
export function updateShiftsGroup(data) {
  return request({
    url: '/model/shiftsGroup',
    method: 'put',
    data: data
  })
}

// 删除轮班组
export function delShiftsGroup(id) {
  return request({
    url: '/model/shiftsGroup/' + id,
    method: 'delete'
  })
}

export function getAreaSelectList(query) {
  return request({
    url: '/model/shiftsGroup/getAreaSelectList',
    method: 'get',
    params: query
  })
}

// 查询轮班组详细
export function getAreaAllocationList(id) {
  return request({
    url: '/model/shiftsGroup/getAreaAllocationList/' + id,
    method: 'get'
  })
}
