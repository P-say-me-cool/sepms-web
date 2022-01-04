import request from '@/utils/request'

// 查询配煤单
export function getBlendlikeListMain(query) {
  return request({
    url: '/coking/blendListMain/likeList',
    method: 'get',
    params:query
  })
}

// 查询配煤消耗列表
export function getCoalBlendConsumes(query) {
  return request({
    url: '/coking/consume/getCoalBlendConsumes',
    method: 'get',
    params:query
  })
}



// 消耗煤种补入
export function coalInterpolation(query) {
  return request({
    url: '/coking/consume/coalInterpolation',
    method: 'post',
    data:query
  })
}


// 获取配煤消耗详细信息
export function getInfo(query) {
  return request({
    url: '/coking/consume/'+query,
    method: 'get'
  })
}


// 查询配煤消耗列表
export function list(query) {
  return request({
    url: '/coking/consume/list',
    method: 'get',
    params:query
  })
}

// 删除配煤消耗列表
export function remove(query) {
  return request({
    url: '/coking/consume/'+query,
    method: 'delete'
  })
}

// 修改配煤消耗列表
export function saveBatch(query) {
  return request({
    url: '/coking/consume/saveBatch',
    method: 'post',
    data:query
  })
}

// 修改配煤消耗列表
export function updateBatch(query) {
  return request({
    url: '/coking/consume/updateBatch',
    method: 'post',
    data:query
  })
}
