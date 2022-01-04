import request from '@/utils/request'

// 查询炉孔配置列表
export function listConfigure(query) {
  return request({
    url: '/model/configure/list',
    method: 'get',
    params: query
  })
}
// 查询炉孔配置列表
export function listConfigureAll(query) {
  return request({
    url: '/model/configure/listAll',
    method: 'get',
    params: query
  })
}

// 查询炉孔配置详细
export function getConfigure(id) {
  return request({
    url: '/model/configure/' + id,
    method: 'get'
  })
}

// 新增炉孔配置
export function addConfigure(data) {
  return request({
    url: '/model/configure',
    method: 'post',
    data: data
  })
}

// 修改炉孔配置
export function updateConfigure(data) {
  return request({
    url: '/model/configure',
    method: 'put',
    data: data
  })
}

// 删除炉孔配置
export function delConfigure(id) {
  return request({
    url: '/model/configure/' + id,
    method: 'delete'
  })
}
