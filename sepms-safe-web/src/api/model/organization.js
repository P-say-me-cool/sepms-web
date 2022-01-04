import request from '@/utils/request'

// 查询组织架构树列表
export function listOrganization(query) {
  return request({
    url: '/model/organization/list',
    method: 'get',
    params: query
  })
}

// 查询组织架构树详细
export function getOrganization(id) {
  return request({
    url: '/model/organization/' + id,
    method: 'get'
  })
}

// 新增组织架构树
export function addOrganization(data) {
  return request({
    url: '/model/organization',
    method: 'post',
    data: data
  })
}

// 修改组织架构树
export function updateOrganization(data) {
  return request({
    url: '/model/organization',
    method: 'put',
    data: data
  })
}

// 删除组织架构树
export function delOrganization(id) {
  return request({
    url: '/model/organization/' + id,
    method: 'delete'
  })
}
