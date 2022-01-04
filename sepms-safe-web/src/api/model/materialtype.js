import request from '@/utils/request'

// 查询物料类别列表
export function listMaterialtype(query) {
  return request({
    url: '/model/materialtype/list',
    method: 'get',
    params: query
  })
}

// 查询物料类别详细
export function getMaterialtype(id) {
  return request({
    url: '/model/materialtype/' + id,
    method: 'get'
  })
}

// 新增物料类别
export function addMaterialtype(data) {
  return request({
    url: '/model/materialtype',
    method: 'post',
    data: data
  })
}

// 修改物料类别
export function updateMaterialtype(data) {
  return request({
    url: '/model/materialtype',
    method: 'put',
    data: data
  })
}

// 删除物料类别
export function delMaterialtype(id) {
  return request({
    url: '/model/materialtype/' + id,
    method: 'delete'
  })
}

// 查询物料能源类别列表
export function listMaterialEnergyType() {
  return request({
    url: '/model/materialtype/getMaterialEnergyType',
    method: 'get'
  })
}
// 查询物料能源
export function listMaterialEnergy(typeCode) {
  return request({
    url: '/model/materialtype/getMaterialEnergyByTypeCode?typeCode='+typeCode,
    method: 'get'
  })
}



