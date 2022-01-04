import request from '@/utils/request'

// 查询菜单列表
export function listAlarmGroup(query) {
    return request({
      url: '/system/alarmgroup/list',
      method: 'get',
      params: query
    })
  }
  export function listAlarmAlarmadd(data) {
    return request({
      url: '/system/alarmgroup/alarmadd',
      method: 'post',
      data: data
    })
  }
  
  export function listAlarmUpdate(data) {
    return request({
      url: '/system/alarmgroup/alarmupdate',
      method: 'post',
      data: data
    })
  }
  //更新用户信息
  export function updateUsers(data) {
    return request({
      url: '/system/alarmgroup/updateUsers',
      method: 'post',
      data: data
    })
  }
  // 更新范围信息
  export function updateDepts(data) {
    return request({
      url: '/system/alarmgroup/updateDepts',
      method: 'post',
      data: data
    })
  }
  // 查询单条数据
  export function alarmgroupIn(configKey) {
    return request({
      url: '/system/alarmgroup/' + configKey,
      method: 'get'
    })
  }
    // 删除通知数据
  export function alarmgroupDel(data) {
    return request({
      url: '/system/alarmgroup/alarmdelete',
      method: 'post',
      data: data
    })
  }