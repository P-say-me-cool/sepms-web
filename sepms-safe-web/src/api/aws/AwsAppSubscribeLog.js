import request from '@/utils/request'

// 查询应用订阅日志列表
export function listAwsAppSubscribeLog(query) {
  return request({
    url: '/system/AwsAppSubscribeLog/list',
    method: 'get',
    params: query
  })
}

// 查询应用订阅日志详细
export function getAwsAppSubscribeLog(id) {
  return request({
    url: '/system/AwsAppSubscribeLog/' + id,
    method: 'get'
  })
}

// 新增应用订阅日志
export function addAwsAppSubscribeLog(data) {
  return request({
    url: '/system/AwsAppSubscribeLog',
    method: 'post',
    data: data
  })
}

// 修改应用订阅日志
export function updateAwsAppSubscribeLog(data) {
  return request({
    url: '/system/AwsAppSubscribeLog',
    method: 'put',
    data: data
  })
}

// 删除应用订阅日志
export function delAwsAppSubscribeLog(id) {
  return request({
    url: '/system/AwsAppSubscribeLog/' + id,
    method: 'delete'
  })
}

// 恢复应用订阅日志
export function recoveryAwsAppSubscribeLog(id) {
  return request({
    url: '/system/AwsAppSubscribeLog/recovery/' + id,
    method: 'post'
  })
}
