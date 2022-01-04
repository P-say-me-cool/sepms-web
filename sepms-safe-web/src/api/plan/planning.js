import request from '@/utils/request'

// 查询计划编制列表
export function listPlanning(query) {
  return request({
    url: '/plan/planning/list',
    method: 'get',
    params: query
  })
}

// 查询计划编制详细
export function getPlanning(planId) {
  return request({
    url: '/plan/planning/' + planId,
    method: 'get'
  })
}

// 检查名称是否存在
export function getPlanningByName(planName) {
  return request({
    url: '/plan/planning/check/' + planName,
    method: 'get'
  })
}

// 新增计划编制
export function addPlanning(data) {
  return request({
    url: '/plan/planning',
    method: 'post',
    data: data
  })
}

// 修改计划编制
export function updatePlanning(data) {
  return request({
    url: '/plan/planning',
    method: 'put',
    data: data
  })
}

// 删除计划编制
export function delPlanning(planId) {
  return request({
    url: '/plan/planning/' + planId,
    method: 'delete'
  })
}
