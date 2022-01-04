import request from '@/utils/request'

// 查询焦炉测温记录列表
export function listRecord(query) {
  return request({
    url: '/coking/coke/record/list',
    method: 'post',
    params: query
  })
}


// 删除焦炉测温记录
export function delRecord(id) {
  return request({
    url: '/coking/coke/record/' + id,
    method: 'post'
  })
}
