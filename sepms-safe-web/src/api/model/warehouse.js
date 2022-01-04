import request from '@/utils/request'

// 查询装置-仓库装置列表
export function listWarehouse(query) {
  return request({
    url: '/model/warehouse/list',
    method: 'get',
    params: query
  })
}

// 查询装置-仓库装置详细
export function getWarehouse(id) {
  return request({
    url: '/model/warehouse/' + id,
    method: 'get'
  })
}

// 新增装置-仓库装置
export function addWarehouse(data) {
  return request({
    url: '/model/warehouse',
    method: 'post',
    data: data
  })
}

// 修改装置-仓库装置
export function updateWarehouse(data) {
  return request({
    url: '/model/warehouse',
    method: 'put',
    data: data
  })
}

// 删除装置-仓库装置
export function delWarehouse(id) {
  return request({
    url: '/model/warehouse/' + id,
    method: 'delete'
  })
}
