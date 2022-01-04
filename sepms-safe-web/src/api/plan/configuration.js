import request from '@/utils/request'

// 查询计划配置列表
export function listConfiguration(query) {
  return request({
    url: '/plan/configuration/list',
    method: 'get',
    params: query
  })
}
//查询全部量纲列表
export function selectlistUnit() {
  return request({
    url: '/model/unit/selectList',
    method: 'get'
  })
}
// 查询计划配置详细
export function getConfiguration(planConfigurationId) {
  return request({
    url: '/plan/configuration/' + planConfigurationId,
    method: 'get'
  })
}

// 新增计划配置
export function addConfiguration(data) {
  return request({
    url: '/plan/configuration/add',
    method: 'post',
    data: data
  })
}

// 修改计划配置
export function updateConfiguration(data) {
  return request({
    url: '/plan/configuration/update',
    method: 'post',
    data: data
  })
}

// 删除计划配置
export function delConfiguration(planConfigurationId) {
  return request({
    url: '/plan/configuration/' + planConfigurationId,
    method: 'delete'
  })
}
// 计划模糊搜索
export function templateList(data) {
  console.log(data.planPeriodTpye);
  return request({
    url: `/plan/template/list?planPeriodTpye=${data.planPeriodTpye}`,
    method: 'get',
    data: data
  })
}

//物料
export function configurationMaterial(data) {
  return request({
    url: '/plan/configuration/material',
    method: 'get'
  })
}
//查询模板的xlsx
export function queryByTemplate(data) {
  return request({
    url: '/plan/planning/queryByTemplate',
    method: 'post',
    data: data
  })
}

