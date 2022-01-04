import request from '@/utils/request'

// 查询应用服务订阅列表
export function listAwsAppSubscribe(query) {
  return request({
    url: '/system/AwsAppSubscribe/list',
    method: 'get',
    params: query
  })
}

// 查询应用服务订阅详细
export function getAwsAppSubscribe(id) {
  return request({
    url: '/system/AwsAppSubscribe/' + id,
    method: 'get'
  })
}

// 新增应用服务订阅
export function addAwsAppSubscribe(data) {
  return request({
    url: '/system/AwsAppSubscribe',
    method: 'post',
    data: data
  })
}

// 修改应用服务订阅
export function updateAwsAppSubscribe(data) {
  return request({
    url: '/system/AwsAppSubscribe',
    method: 'put',
    data: data
  })
}

// 删除应用服务订阅
export function delAwsAppSubscribe(id) {
  return request({
    url: '/system/AwsAppSubscribe/' + id,
    method: 'delete'
  })
}

// 启用
export function enableAppSubscribe(id) {
  return request({
    url: '/system/AwsAppSubscribe/enable/' + id,
    method: 'post'
  })
}

// 停用
export function disableAppSubscribe(id) {
  return request({
    url: '/system/AwsAppSubscribe/disable/' + id,
    method: 'post'
  })
}

// 查询订阅列表
export function listAwsAppSubscribeByWithAuth(query) {
  return request({
    url: '/system/AwsAppSubscribe/listByWithAuth',
    method: 'get',
    params: query
  })
}

// 查询应用没有订阅的列表
export function listAwsAppSubscribeByWithoutAuth(query) {
  return request({
    url: '/system/AwsAppSubscribe/listByWithoutAuth',
    method: 'get',
    params: query
  })
}
