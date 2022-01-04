import request from '@/utils/request'

// 查询物料信息列表
export function listMaterialinfo(query) {
  return request({
    url: '/model/materialinfo/list',
    method: 'get',
    params: query
  })
}
// 查询物料信息列表 无分页
export function selectMaterialinfo(query) {
  return request({
    url: '/model/materialinfo/selectList',
    method: 'get',
    params: query
  })
}
export function listTypeMaterialinfo(query) {
  return request({
    url: '/model/materialinfo/typeList',
    method: 'get',
    params: query
  })
}
// 查询物料信息详细
export function getMaterialinfo(id) {
  return request({
    url: '/model/materialinfo/' + id,
    method: 'get'
  })
}

// 新增物料信息
export function addMaterialinfo(data) {
  return request({
    url: '/model/materialinfo',
    method: 'post',
    data: data
  })
}

// 修改物料信息
export function updateMaterialinfo(data) {
  return request({
    url: '/model/materialinfo',
    method: 'put',
    data: data
  })
}

// 删除物料信息
export function delMaterialinfo(id) {
  return request({
    url: '/model/materialinfo/' + id,
    method: 'delete'
  })
}
