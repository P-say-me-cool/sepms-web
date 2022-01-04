import request from '@/utils/request'

// 查询工艺指标列表
export function listIndicators(query) {
  return request({
    url: '/operation/indicators/list',
    method: 'get',
    params: query
  })
}

// 工艺指标选择列表
export function selectListIndicators(query) {
  return request({
    url: '/operation/indicators/selectList',
    method: 'get',
    params: query
  })
}

// 查询工艺指标详细
export function getIndicators(id) {
  return request({
    url: '/operation/indicators/' + id,
    method: 'get'
  })
}

// 新增工艺指标
export function addIndicators(data) {
  return request({
    url: '/operation/indicators',
    method: 'post',
    data: data
  })
}

// 修改工艺指标
export function updateIndicators(data) {
  return request({
    url: '/operation/indicators',
    method: 'put',
    data: data
  })
}

// 删除工艺指标
export function delIndicators(id) {
  return request({
    url: '/operation/indicators/' + id,
    method: 'delete'
  })
}
