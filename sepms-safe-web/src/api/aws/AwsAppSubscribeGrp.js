import request from '@/utils/request'

// 查询应用服务订阅组列表
export function listAwsAppSubscribeGrp(query) {
  return request({
    url: '/system/AwsAppSubscribeGrp/list',
    method: 'get',
    params: query
  })
}

// 查询应用服务订阅组详细
export function getAwsAppSubscribeGrp(id) {
  return request({
    url: '/system/AwsAppSubscribeGrp/' + id,
    method: 'get'
  })
}

// 新增应用服务订阅组
export function addAwsAppSubscribeGrp(data) {
  return request({
    url: '/system/AwsAppSubscribeGrp',
    method: 'post',
    data: data
  })
}

// 修改应用服务订阅组
export function updateAwsAppSubscribeGrp(data) {
  return request({
    url: '/system/AwsAppSubscribeGrp',
    method: 'put',
    data: data
  })
}

// 删除应用服务订阅组
export function delAwsAppSubscribeGrp(id) {
  return request({
    url: '/system/AwsAppSubscribeGrp/' + id,
    method: 'delete'
  })
}

// 启用
export function enableAppSubscribeGrp(id) {
  return request({
    url: '/system/AwsAppSubscribeGrp/enable/' + id,
    method: 'post'
  })
}

// 停用
export function disableAppSubscribeGrp(id) {
  return request({
    url: '/system/AwsAppSubscribeGrp/disable/' + id,
    method: 'post'
  })
}

// 添加订阅
export function authAwsAppSubscribe(awsAppSubscribeGrpId, awsAppSubscribeIds) {
  return request({
    url: '/system/AwsAppSubscribeGrp/auth/' + awsAppSubscribeGrpId + '/' + awsAppSubscribeIds,
    method: 'post'
  })
}

// 取消订阅
export function cancelAuthAwsAppSubscribe(awsAppSubscribeGrpId, awsAppSubscribeIds) {
  return request({
    url: '/system/AwsAppSubscribeGrp/cancelAuth/' + awsAppSubscribeGrpId + '/' + awsAppSubscribeIds,
    method: 'post'
  })
}
