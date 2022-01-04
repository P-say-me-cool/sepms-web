import request from '@/utils/request'

// 查询仓库管理-入库记录列表
export function listHouse(query) {
  return request({
    url: '/material/wareHouse/list',
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


// 保存按钮
export function  keepHouse(data) {
  return request({
    url: '/material/wareHouse/save',
    method: 'POST',
    data: data
  })
}


//取消提交 按钮-库存记录
export function cancelSubmitHouse(data) {
  return request({
    url: '/material/wareHouse/cancelSubmit',
    method: 'POST',
    data: data
  })
}

// 提交按钮-库存记录
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
