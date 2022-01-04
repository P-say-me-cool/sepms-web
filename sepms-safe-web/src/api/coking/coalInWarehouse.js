import request from '@/utils/request'

// 原料煤入库
export function coalInWarehouseApi(query) {
  return request({
    url: '/coking/web/CoalInWarehouse/selectCoalInWarehouse',
    method: 'get',
    params: query
  })
}

// 行内编辑煤堆 下拉框
export function coalHeapByMaterialIdApi(query) {
  return request({
    url: '/coking/web/CoalHeap/selectCoalHeapByMaterialId',
    method: 'get',
    params: query
  })
}

// 保存
export function saveInWarehouseApi(body) {
  return request({
    url: '/coking/web/CoalInWarehouse/saveInWarehouse',
    method: 'post',
    data: body
  })
}

// 审核
export function stoExamineApi(ids) {
  return request({
    url: '/coking/web/CoalInWarehouse/toExamine?ids=' + ids,
    method: 'get'
  })
}

// 提交
export function coalInWarehouseSubmitApi(data) {
  return request({
    url: '/coking/web/CoalInWarehouse/submit',
    method: 'post',
    data: data
  })
}

// 解除提交
export function coalInWarehouseCancelSubmitApi(data) {
  return request({
    url: '/coking/web/CoalInWarehouse/cancelSubmit',
    method: 'post',
    data: data
  })


}

// 行内编辑煤堆 下拉框
export function selectCoalHeapListApi() {
  return request({
    url: '/coking/web/CoalHeap/selectCoalHeapDefinition',
    method: 'get',
  })
}

