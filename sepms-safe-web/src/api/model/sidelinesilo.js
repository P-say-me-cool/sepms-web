import request from '@/utils/request'

// 装置查询
export function queryDevices(query) {
  return request({
    url: '/model/silo/devicelist',
    method: 'get',
    params: query
  })
}

// 侧线查询
export function listSideLines(query) {
  return request({
    url: '/model/silo/sidequery',
    method: 'get',
    params: query
  })
}

// 料仓查询
export function listSilo(query) {
  return request({
    url: '/model/silo/siloquery',
    method: 'get',
    params: query
  })
}

//根据侧线ID查询关联的料仓
export function querySiloBySideLineId(id) {
  return request({
    url: '/model/silo/' + id,
    method: 'get'
  })
}

//新增关系
export function insertSideLineSilo(data) {
  return request({
    url: '/model/silo',
    method: 'post',
    data: data
  })
}

//删除关系
export function delSideLineSilo(id) {
  return request({
    url: '/model/silo/' + id,
    method: 'delete'
  })
}

//修改启用或不启用
export function updateSideLineSilo(data) {
  return request({
    url: '/model/silo',
    method: 'put',
    data: data
  })
}
