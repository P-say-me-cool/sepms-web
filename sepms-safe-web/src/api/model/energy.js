import request from '@/utils/request'

// 查询能源管理列表
export function listEnergy(query) {
  return request({
    url: '/model/energy/list',
    method: 'get',
    params: query
  })
}

export function selectListEnergy(query) {
  return request({
    url: '/model/energy/selectList',
    method: 'get',
    params: query
  })
}

// 查询能源管理详细
export function getEnergy(id) {
  return request({
    url: '/model/energy/' + id,
    method: 'get'
  })
}

// 新增能源管理
export function addEnergy(data) {
  return request({
    url: '/model/energy',
    method: 'post',
    data: data
  })
}

// 修改能源管理
export function updateEnergy(data) {
  return request({
    url: '/model/energy',
    method: 'put',
    data: data
  })
}

// 删除能源管理
export function delEnergy(id) {
  return request({
    url: '/model/energy/' + id,
    method: 'delete'
  })
}
