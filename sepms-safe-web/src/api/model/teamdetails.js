import request from '@/utils/request'

// 查询班组明细列表
export function listTeamdetails(query) {
  return request({
    url: '/model/teamdetails/list',
    method: 'get',
    params: query
  })
}

// 查询班组明细详细
export function getTeamdetails(id) {
  return request({
    url: '/model/teamdetails/' + id,
    method: 'get'
  })
}

// 新增班组明细
export function addTeamdetails(data) {
  return request({
    url: '/model/teamdetails',
    method: 'post',
    data: data
  })
}

// 修改班组明细
export function updateTeamdetails(data) {
  return request({
    url: '/model/teamdetails',
    method: 'put',
    data: data
  })
}

// 删除班组明细
export function delTeamdetails(id) {
  return request({
    url: '/model/teamdetails/' + id,
    method: 'delete'
  })
}
