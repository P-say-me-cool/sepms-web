import request from '@/utils/request'

// 查询侧线列表
export function listPipe(query) {
  return request({
    url: '/model/pipe/list',
    method: 'get',
    params: query
  })
}

// 查询侧线详细
export function getPipe(id) {
  return request({
    url: '/model/pipe/' + id,
    method: 'get'
  })
}

// 新增侧线
export function addPipe(data) {
  return request({
    url: '/model/pipe',
    method: 'post',
    data: data
  })
}

// 修改侧线
export function updatePipe(data) {
  return request({
    url: '/model/pipe',
    method: 'put',
    data: data
  })
}

// 删除侧线
export function delPipe(id) {
  return request({
    url: '/model/pipe/' + id,
    method: 'delete'
  })
}

// 根据条件查询侧线
export function listByIds(query) {
  return request({
    url: '/model/pipe/listByIds',
    method: 'get',
    params: query
  })
}

// 根据工厂id查询侧线
export function selectAllPmPipeByFactoryId(factoryId) {
  return request({
    url: '/model/pipe/selectAllPmPipeByFactoryId?factoryId='+factoryId,
    method: 'get'
  })
}

