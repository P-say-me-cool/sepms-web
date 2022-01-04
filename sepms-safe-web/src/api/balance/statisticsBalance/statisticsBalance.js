import request from '@/utils/request'

// 查询统计平衡明细列表
export function listStatisticsBalance(query) {
  return request({
    url: '/material/statisticsBalance/list',
    method: 'get',
    params: query
  })
}
// 汇总统计平衡明细列表
export function listStatisticsBalanceSum(query) {
  return request({
    url: '/material/statisticsBalance/statistics',
    method: 'get',
    params: query
  })
}

// 查询统计平衡明细详细
export function getStatisticsBalance(id) {
  return request({
    url: '/material/statisticsBalance/' + id,
    method: 'get'
  })
}

// 新增统计平衡明细
export function addStatisticsBalance(data) {
  return request({
    url: '/material/statisticsBalance',
    method: 'post',
    data: data
  })
}

// 修改统计平衡明细
export function updateStatisticsBalance(data) {
  return request({
    url: '/material/statisticsBalance',
    method: 'put',
    data: data
  })
}

// 删除统计平衡明细
export function delStatisticsBalance(id) {
  return request({
    url: '/material/statisticsBalance/' + id,
    method: 'delete'
  })
}
