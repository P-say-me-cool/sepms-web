import request from '@/utils/request'

// 查询告警信息列表
export function listAlarms(query) {
  return request({
    url: '/operation/alarms/list',
    method: 'get',
    params: query
  })
}

// 查询告警信息详细
export function getAlarms(id) {
  return request({
    url: '/operation/alarms/' + id,
    method: 'get'
  })
}

// 新增告警信息
export function addAlarms(data) {
  return request({
    url: '/operation/alarms/ack',
    method: 'post',
    data: data
  })
}

// 修改告警信息
export function updateAlarms(data) {
  return request({
    url: '/operation/alarms',
    method: 'put',
    data: data
  })
}

export function warning() {
  return request({
    url: '/operation/alarms/listCurrentDay',
    method: 'get',
  })
}

export function ackAlarms(ids, indicatorsIds,ackTime,opReason) {
  return request({
    url: '/operation/alarms/ack',
    method: 'post',
    data: {
      "indicatorsIds": indicatorsIds,
      "ids": ids,
      "ackTime": ackTime,
      "opReason":opReason
    }
  })
}



export function idsAlarms(ids) {
  return request({
    url: '/operation/alarms/ids',
    method: 'post',
    data: {
      "ids": ids
    }
  })
}




export function recentAlarms(id) {
  return request({
    url: '/operation/alarms/log/' + id,
    method: 'get'
  })
}
