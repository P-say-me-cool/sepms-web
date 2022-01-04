import request from '@/utils/request'

// 查询应用服务调用日志列表
export function listAwsAppPublishLog(query) {
  return request({
    url: '/system/AwsAppPublishLog/list',
    method: 'get',
    params: query
  })
}

// 查询应用服务调用日志详细
export function getAwsAppPublishLog(id) {
  return request({
    url: '/system/AwsAppPublishLog/' + id,
    method: 'get'
  })
}

// 新增应用服务调用日志
export function addAwsAppPublishLog(data) {
  return request({
    url: '/system/AwsAppPublishLog',
    method: 'post',
    data: data
  })
}

// 修改应用服务调用日志
export function updateAwsAppPublishLog(data) {
  return request({
    url: '/system/AwsAppPublishLog',
    method: 'put',
    data: data
  })
}

// 删除应用服务调用日志
export function delAwsAppPublishLog(id) {
  return request({
    url: '/system/AwsAppPublishLog/' + id,
    method: 'delete'
  })
}
