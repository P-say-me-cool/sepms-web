import request from '@/utils/request'

// 查询轮班组界区列表
export function listShiftsArea(query) {
  return request({
    url: '/model/shiftsArea/list',
    method: 'get',
    params: query
  })
}

// 查询轮班组界区详细
export function getShiftsArea(groupId) {
  return request({
    url: '/model/shiftsArea/' + groupId,
    method: 'get'
  })
}

// 新增轮班组界区
export function addShiftsArea(data) {
  return request({
    url: '/model/shiftsArea',
    method: 'post',
    data: data
  })
}

// 修改轮班组界区
export function updateShiftsArea(data) {
  return request({
    url: '/model/shiftsArea',
    method: 'put',
    data: data
  })
}

// 删除轮班组界区
export function delShiftsArea(groupId) {
  return request({
    url: '/model/shiftsArea/' + groupId,
    method: 'delete'
  })
}
