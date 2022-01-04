import request from '@/utils/request'

// 查询岗位列表
export function listPost(query) {
  return request({
    url: '/system/post/list',
    method: 'get',
    params: query
  })
}
export function selectListPost(query) {
  return request({
    url: '/system/post/selectList',
    method: 'get',
    params: query
  })
}

// 查询岗位详细
export function getPost(postId) {
  return request({
    url: '/system/post/' + postId,
    method: 'get'
  })
}

// 新增岗位
export function addPost(data) {
  return request({
    url: '/system/post',
    method: 'post',
    data: data
  })
}

// 修改岗位
export function updatePost(data) {
  return request({
    url: '/system/post',
    method: 'put',
    data: data
  })
}

// 删除岗位
export function delPost(postId) {
  return request({
    url: '/system/post/' + postId,
    method: 'delete'
  })
}

//查询配置模板
export function getModelLog(postId) {
  return request({
    url: '/system/modelLog/' + postId,
    method: 'get'
  })
}

// 添加日志模板
export function addModelLog(data) {
  return request({
    url: '/system/modelLog/add',
    method: 'post',
    data: data
  })
}
