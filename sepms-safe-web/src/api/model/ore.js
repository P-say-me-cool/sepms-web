import request from '@/utils/request'

// 查询矿点管理列表
export function listOre(query) {
  return request({
    url: '/model/ore/list',
    method: 'get',
    params: query
  })
}

// 查询矿点管理详细
export function getOre(id) {
  return request({
    url: '/model/ore/' + id,
    method: 'get'
  })
}

// 新增矿点管理
export function addOre(data) {
  return request({
    url: '/model/ore',
    method: 'post',
    data: data
  })
}

// 修改矿点管理
export function updateOre(id, isUse) {
  const data = {
    id,
    isUse
  }
  return request({
    url: '/model/ore',
    method: 'put',
    data: data
  })
}

// 删除矿点管理
export function delOre(id) {
  return request({
    url: '/model/ore/' + id,
    method: 'delete'
  })
}
