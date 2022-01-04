import request from '@/utils/request'

// 查询应用服务发布列表
export function listAwsAppPublish(query) {
  return request({
    url: '/system/AwsAppPublish/list',
    method: 'get',
    params: query
  })
}

// 查询应用服务发布详细
export function getAwsAppPublish(id) {
  return request({
    url: '/system/AwsAppPublish/' + id,
    method: 'get'
  })
}

// 新增应用服务发布
export function addAwsAppPublish(data) {
  return request({
    url: '/system/AwsAppPublish',
    method: 'post',
    data: data
  })
}

// 修改应用服务发布
export function updateAwsAppPublish(data) {
  return request({
    url: '/system/AwsAppPublish',
    method: 'put',
    data: data
  })
}

// 删除应用服务发布
export function delAwsAppPublish(id) {
  return request({
    url: '/system/AwsAppPublish/' + id,
    method: 'delete'
  })
}

// 启用
export function enableAppPublish(id) {
  return request({
    url: '/system/AwsAppPublish/enable/' + id,
    method: 'post'
  })
}

// 停用
export function disableAppPublish(id) {
  return request({
    url: '/system/AwsAppPublish/disable/' + id,
    method: 'post'
  })
}

// 查询订阅列表
export function listAwsAppPublishByWithAuth(query) {
  return request({
    url: '/system/AwsAppPublish/listByWithAuth',
    method: 'get',
    params: query
  })
}

// 查询应用没有授权的服务发布列表
export function listAwsAppPublishByWithoutAuth(query) {
  return request({
    url: '/system/AwsAppPublish/listByWithoutAuth',
    method: 'get',
    params: query
  })
}
