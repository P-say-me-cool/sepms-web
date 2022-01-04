import request from '@/utils/request'

// 查询模板列表
export function listTemplate(query) {
  return request({
    url: '/plan/template/list',
    method: 'get',
    params: query
  })
}

export function listTemplateed(query) {
  return request({
    url: '/plan/template/listOwn',
    method: 'get',
    params: query
  })
}

// 查询模板详细
export function getTemplate(templateId) {
  return request({
    url: '/plan/template/' + templateId,
    method: 'get'
  })
}

// 检查名称是否存在
export function getTemplateByName(templateName) {
  return request({
    url: '/plan/template/check/' + templateName,
    method: 'get'
  })
}

// 新增模板
export function addTemplate(data) {
  return request({
    url: '/plan/template',
    method: 'post',
    data: data
  })
}

// 修改模板
export function updateTemplate(data) {
  return request({
    url: '/plan/template',
    method: 'put',
    data: data
  })
}

// 删除模板
export function delTemplate(templateId) {
  return request({
    url: '/plan/template/' + templateId,
    method: 'delete'
  })
}
