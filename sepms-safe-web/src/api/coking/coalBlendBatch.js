import request from '@/utils/request'


// 查询配煤消耗列表
export function batchlist(query) {
  return request({
    url: '/coking/batchconsume/findTimeList',
    method: 'post',
    params:query
  })
}


// 查询配煤消耗详情列表
export function findCoalCodeList(query) {
  return request({
    url: '/coking/batchconsume/findCoalCodeList',
    method: 'post',
    params:query
  })
}
