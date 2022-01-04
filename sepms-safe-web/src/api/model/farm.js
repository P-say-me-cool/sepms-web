import request from '@/utils/request'

// 查询车间列表
export function listFarm(query) {
  return request({
    url: '/model/farm/list',
    method: 'get',
    params: query
  })
}

// 查询车间详细
export function getFarm(id) {
  return request({
    url: '/model/farm/' + id,
    method: 'get'
  })
}

// 新增车间
export function addFarm(data) {
  return request({
    url: '/model/farm',
    method: 'post',
    data: data
  })
}

// 修改车间
export function updateFarm(data) {
  return request({
    url: '/model/farm',
    method: 'put',
    data: data
  })
}

// 删除车间
export function delFarm(id) {
  return request({
    url: '/model/farm/' + id,
    method: 'delete'
  })
}
