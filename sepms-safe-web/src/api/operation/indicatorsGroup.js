import request from '@/utils/request'

// 查询工艺指标组列表
export function listIndicatorsGroup(query) {
  return request({
    url: '/operation/indicatorsGroup/list',
    method: 'get',
    params: query
  })
}
// 查询工艺指标组列表
export function selectListIndicatorsGroup(query) {
  return request({
    url: '/operation/indicatorsGroup/selectList',
    method: 'get',
    params: query
  })
}
// 查询工艺指标组详细
export function getIndicatorsGroup(id) {
  return request({
    url: '/operation/indicatorsGroup/' + id,
    method: 'get'
  })
}

// 新增工艺指标组
export function addIndicatorsGroup(data) {
  return request({
    url: '/operation/indicatorsGroup',
    method: 'post',
    data: data
  })
}

// 修改工艺指标组
export function updateIndicatorsGroup(data) {
  return request({
    url: '/operation/indicatorsGroup',
    method: 'put',
    data: data
  })
}

// 删除工艺指标组
export function delIndicatorsGroup(id) {
  return request({
    url: '/operation/indicatorsGroup/' + id,
    method: 'delete'
  })
}
