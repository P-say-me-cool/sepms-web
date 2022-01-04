import request from '@/utils/request'

// 查询计划审核列表
export function listReview(query) {
  return request({
    url: '/plan/review/list',
    method: 'get',
    params: query
  })
}

// 查询计划审核详细
export function getReview(reviewId) {
  return request({
    url: '/plan/review/' + reviewId,
    method: 'get'
  })
}

// 新增计划审核
export function addReview(data) {
  return request({
    url: '/plan/review',
    method: 'post',
    data: data
  })
}

// 修改计划审核
export function updateReview(data) {
  return request({
    url: '/plan/review',
    method: 'put',
    data: data
  })
}

// 删除计划审核
export function delReview(reviewId) {
  return request({
    url: '/plan/review/' + reviewId,
    method: 'delete'
  })
}
