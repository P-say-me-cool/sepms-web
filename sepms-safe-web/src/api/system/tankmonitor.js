import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listTankDatas(query) {
  return request({
    url: '/system/farm/monitorlist',
    method: 'get',
    params: query
  })
}

// 查询详细
export function getFarm(id) {
  return request({
    url: '/system/farm/' + id,
    method: 'get'
  })
}

// 新增
export function addFarm(data) {
  return request({
    url: '/system/farm',
    method: 'post',
    data: data
  })
}

// 修改
export function updateFarm(data) {
  return request({
    url: '/system/farm',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delFarm(id) {
  return request({
    url: '/system/farm/' + id,
    method: 'delete'
  })
}

//查询罐信息
export function queryTankList(query) {
  return request({
    url: '/system/farm/tanklist',
    method: 'get',
    params: query
  })
}

// 分配罐
export function addTankConfigration(data) {
  return request({
    url: '/system/farm/addtank',
    method: 'post',
    data: data
  })
}

// 修改
export function updateTankMonitor(data) {
  return request({
    url: '/system/farm/monitor',
    method: 'put',
    data: data
  })
}
