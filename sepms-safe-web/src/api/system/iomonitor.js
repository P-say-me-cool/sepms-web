import request from '@/utils/request'

// 查询monitor列表
export function listIoMonitor(query) {
  return request({
    url: '/system/iomonitor/list',
    method: 'get',
    params: query
  })
}
//插叙物料信息
export function queryMaterial(query) {
  return request({
    url: '/system/iomonitor/queryMaterial',
    method: 'get',
    params: query
  })
}

// 查询monitor详细
export function getIoMonitor(monitorid) {
  return request({
    url: '/system/iomonitor/' + monitorid,
    method: 'get'
  })
}

// 新增monitor
export function addIoMonitor(data) {
  return request({
    url: '/system/iomonitor',
    method: 'post',
    data: data
  })
}

// 修改monitor
export function updateIoMonitor(data) {
  return request({
    url: '/system/iomonitor',
    method: 'put',
    data: data
  })
}

// 删除monitor
export function delIoMonitor(monitorid) {
  return request({
    url: '/system/iomonitor/' + monitorid,
    method: 'delete'
  })
}
