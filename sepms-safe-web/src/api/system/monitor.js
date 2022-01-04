import request from '@/utils/request'

// 查询进出厂点监控组列表
export function listMonitor(query) {
  return request({
    url: '/system/monitor/list',
    method: 'get',
    params: query
  })
}

// 查询进出厂点监控组列表
export function listMonitorIO(query) {
  return request({
    url: '/system/monitor/listio',
    method: 'get',
    params: query
  })
}

// 查询进出厂点监控组详细
export function getMonitor(id) {
  return request({
    url: '/system/monitor/' + id,
    method: 'get'
  })
}

export function getIOMonitor(query) {
  return request({
    url: '/system/monitor/getIO/',
    method: 'get',
    params: query
  })
}

// 查询进出厂点监控组详细
export function getMonitorInfo(query) {
  return request({
    url: '/system/monitor/operator',
    method: 'get',
    params: query
  })
}

export function getIoList(id) {
  return request({
    url: '/system/monitor/listByFacId?id='+id,
    method: 'get'
  })
}

// 新增进出厂点监控组
export function addMonitor(data) {
  return request({
    url: '/system/monitor',
    method: 'post',
    data: data
  })
}

// 修改进出厂点监控组
export function updateMonitor(data) {
  return request({
    url: '/system/monitor',
    method: 'put',
    data: data
  })
}

// 删除进出厂点监控组
export function delMonitor(id) {
  return request({
    url: '/system/monitor/' + id,
    method: 'delete'
  })
}
