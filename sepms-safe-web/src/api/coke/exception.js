import request from '@/utils/request'

// 查询推焦实际列表
export function listException(query) {
  return request({
    url: '/coking/coke/exception/list',
    method: 'get',
    params: query
  })
}


// 修改推焦实际
export function updateException(data) {
  return request({
    url: '/coking/coke/exception/updateBatch',
    method: 'post',
    data: data
  })
}


// 查询偏差原因列表
export function findDeviationReasonList(data) {
  return request({
    url: '/coking/coke/exception/findDeviationReasonList/'+data,
    method: 'post',
  })
}
