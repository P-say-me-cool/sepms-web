import request from '@/utils/request'

// 查询装置-进出场装置列表
export function listInOut(query) {
  return request({
    url: '/model/inOut/list',
    method: 'get',
    params: query
  })
}

// 查询装置-进出场装置详细
export function getInOut(id) {
  return request({
    url: '/model/inOut/' + id,
    method: 'get'
  })
}

// 新增装置-进出场装置
export function addInOut(data) {
  return request({
    url: '/model/inOut',
    method: 'post',
    data: data
  })
}

// 修改装置-进出场装置
export function updateInOut(data) {
  return request({
    url: '/model/inOut',
    method: 'put',
    data: data
  })
}

// 删除装置-进出场装置
export function delInOut(id) {
  return request({
    url: '/model/inOut/' + id,
    method: 'delete'
  })
}
