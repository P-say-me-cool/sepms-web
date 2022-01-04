import request from '@/utils/request'

// 查询仓库管理-入库记录列表
export function listHouse(query) {
  return request({
    url: '/material/inWareHouse/list',
    method: 'get',
    params: query
  })
}

// 查询仓库管理-入库记录详细
export function getHouse(id) {
  return request({
    url: '/material/house/' + id,
    method: 'get'
  })
}

// 新增仓库管理-入库记录
export function addHouse(data) {
  return request({
    url: '/material/inWareHouse/add',
    method: 'post',
    data: data
  })
}

// 修改仓库管理-入库记录
export function updateHouse(data) {
  return request({
    url: '/material/inWareHouse/edit',
    method: 'post',
    data: data
  })
}

// 删除仓库管理-入库记录
export function delHouse(query) {
  return request({
    url: '/material/inWareHouse/remove',
    method: 'get',
    params: query
  })
}


// 删除仓库管理-入库记录
export function submitHouse(data) {
  return request({
    url: '/material/wareHouse/submit',
    method: 'POST',
    data: data
  })
}

// 升降级仓库管理-入库记录
export function upDownHouse(data) {
  return request({
    url: '/material/wareHouse/upDown',
    method: 'POST',
    data: data
  })
}

