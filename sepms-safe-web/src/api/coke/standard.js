import request from '@/utils/request'

// 查询热工标准列表
export function listStandard(query) {
  return request({
    url: '/coking/coke/standard/list',
    method: 'get',
    params: query
  })
}


// 新增/修改热工标准
export function saveOrupdateStandard(data) {
  return request({
    url: '/coking/coke/standard',
    method: 'post',
    data: data
  })
}

// 批量新增热工标准
export function insertBatchThermalStandard(data) {
  return request({
    url: '/coking/coke/standard/insertBatchThermalStandard',
    method: 'post',
    data: data
  })
}

// 批量修改热工标准
export function updateBatchThermalStandard(data) {
  return request({
    url: '/coking/coke/standard/updateBatchThermalStandard',
    method: 'post',
    data: data
  })
}

// 审核热工标准
export function auditStandard(data) {
  return request({
    url: '/coking/coke/standard',
    method: 'put',
    data: data
  })
}

// 删除热工标准
export function delStandard(id) {
  return request({
    url: '/coking/coke/standard/' + id,
    method: 'delete'
  })
}

