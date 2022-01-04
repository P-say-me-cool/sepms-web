import request from '@/utils/request'

// 出库记录列表
export function listHouse(query) {
  return request({
    url: '/material/outWareHouse/list',
    method: 'get',
    params: query
  })
}
//添加出库按钮 
export function updateHouse(data) {
  return request({
    url: '/material/outWareHouse/update',
    method: 'POST',
    data: data
  })
}

//添加出库按钮 
export function addHouse(data) {
  return request({
    url: '/material/outWareHouse/add',
    method: 'POST',
    data: data
  })
}
// 删除出库按钮
export function removeHouse(query) {
  return request({
    url: '/material/outWareHouse/remove',
    method: 'GET',
    params: query
  })
}