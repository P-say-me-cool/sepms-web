import request from '@/utils/request'

// 查询班组人员表列表
export function listPerson(query) {
  return request({
    url: '/model/person/list',
    method: 'get',
    params: query
  })
}

// 查询班组人员表详细
export function getPerson(id) {
  return request({
    url: '/model/person/' + id,
    method: 'get'
  })
}

// 新增班组人员表
export function addPerson(data) {
  return request({
    url: '/model/person',
    method: 'post',
    data: data
  })
}

// 修改班组人员表
export function updatePerson(data) {
  return request({
    url: '/model/person',
    method: 'put',
    data: data
  })
}

// 删除班组人员表
export function delPerson(id) {
  return request({
    url: '/model/person/' + id,
    method: 'delete'
  })
}
