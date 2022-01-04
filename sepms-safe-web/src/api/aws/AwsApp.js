import request from '@/utils/request'

// 查询应用信息列表
export function listAwsApp(query) {
  return request({
    url: '/system/AwsApp/list',
    method: 'get',
    params: query
  })
}

// 查询所有应用信息列表
export function listAllAwsApp() {
  return request({
    url: '/system/AwsApp/listAll',
    method: 'get',
  })
}

// 查询应用信息详细
export function getAwsApp(id) {
  return request({
    url: '/system/AwsApp/' + id,
    method: 'get'
  })
}

// 新增应用信息
export function addAwsApp(data) {
  return request({
    url: '/system/AwsApp',
    method: 'post',
    data: data
  })
}

// 修改应用信息
export function updateAwsApp(data) {
  return request({
    url: '/system/AwsApp',
    method: 'put',
    data: data
  })
}

// 删除应用信息
export function delAwsApp(id) {
  return request({
    url: '/system/AwsApp/' + id,
    method: 'delete'
  })
}

// 生成AppId
export function genAppId() {
  return request({
    url: '/system/AwsApp/genAppId',
    method: 'get'
  })
}

// 生成AppKey
export function genAppKey() {
  return request({
    url: '/system/AwsApp/genAppKey',
    method: 'get'
  })
}

// 启用
export function enableApp(id) {
  return request({
    url: '/system/AwsApp/enable/' + id,
    method: 'post'
  })
}

// 停用
export function disableApp(id) {
  return request({
    url: '/system/AwsApp/disable/' + id,
    method: 'post'
  })
}

// 授权服务
export function authAwsAppPublish(awsAppId, awsAppPublishIds) {
  return request({
    url: '/system/AwsApp/auth/' + awsAppId + '/' + awsAppPublishIds,
    method: 'post'
  })
}

// 取消授权服务
export function cancelAuthAwsAppPublish(awsAppId, awsAppPublishIds) {
  return request({
    url: '/system/AwsApp/cancelAuth/' + awsAppId + '/' + awsAppPublishIds,
    method: 'post'
  })
}
