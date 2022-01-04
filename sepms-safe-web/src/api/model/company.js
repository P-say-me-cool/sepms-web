import request from '@/utils/request'

// 查询公司组织列表
export function listCompany(query) {
  return request({
    url: '/model/company/list',
    method: 'get',
    params: query
  })
}

// 查询公司组织详细
export function getCompany(id) {
  return request({
    url: '/model/company/' + id,
    method: 'get'
  })
}

// 新增公司组织
export function addCompany(data) {
  return request({
    url: '/model/company',
    method: 'post',
    data: data
  })
}

// 修改公司组织
export function updateCompany(data) {
  return request({
    url: '/model/company',
    method: 'put',
    data: data
  })
}

// 删除公司组织
export function delCompany(id) {
  return request({
    url: '/model/company/' + id,
    method: 'delete'
  })
}
