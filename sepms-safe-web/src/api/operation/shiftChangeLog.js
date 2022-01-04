import request from '@/utils/request'

// 查询交接班管理列表
export function listShiftChange(query) {
  return request({
    url: '/operation/shiftChangeLog/list',
    method: 'get',
    params: query
  })
}

// 查询交接班管理详细
export function getShiftChange(id) {
  return request({
    url: '/operation/shiftChangeLog/' + id,
    method: 'get'
  })
}
