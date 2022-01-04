import request from '@/utils/request'
// 审核
export function stoExamineApi(ids) {
  return request({
    url: '/coking/web/CoalHeap/toExamine?ids='+ids,
    method: 'get',
  })
}
//本页面--------------
// 查询配煤执行单主列表

// 原料煤入库
export function blendListRunMainApi(query) {
  return request({
    url: '/coking/blendListRunMain/list',
    method: 'get',
    params:query,
  })
}

export function selectByListIdSort(query) {
  return request({
    url: '/coking/blendListRunMain/selectByListIdSort',
    method: 'get',
    params:query,
  })
}
// 查询配煤单号（下拉列表）
export function listNumberListApi(query) {
  return request({
    url: '/coking/blendListRunMain/listNumberList',
    method: 'get',
    params:query,
  })
}

// 新增保存
export function addSaveBlendListRunApi(body) {
  return request({
    url: '/coking/blendListRunMain/addSaveBlendListRun',
    method: 'post',
    data:body
  })
}
// 编辑保存
export function updateSaveBlendListRunApi(body) {
  return request({
    url: '/coking/blendListRunMain/updateSaveBlendListRun',
    method: 'post',
    data:body
  })
}
