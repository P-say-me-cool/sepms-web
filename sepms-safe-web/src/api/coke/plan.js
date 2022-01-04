import request from '@/utils/request'

// 查询推焦计划
export function cokePushList(query) {
  return request({
    url: 'coking/coke/plan/list',
    method: 'post',
    params: query
  })
}


// 修改推焦计划
export function updateCokePush(data) {
  return request({
    url: 'coking/coke/plan/updateBatch',
    method: 'post',
    data: data
  })
}

// 删除推焦计划
export function delCokePush(ids) {
  return request({
    url: 'coking/coke/plan/'+ids,
    method: 'post'
  })
}

