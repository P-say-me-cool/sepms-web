import request from '@/utils/request'

// 保存
export function saveInWarehouseApi(body) {
  return request({
    url: '/coking/web/CoalHeap/saveInWarehouse',
    method: 'post',
    data: body
  })
}

//本页面--------------
// 查询原料煤出库列表
export function coalDeliveryApi(query) {
  return request({
    url: '/coking/CoalDeliveryInventoryDetail/selectList',
    method: 'get',
    params: query
  })
}

//查询原料煤列表下拉菜单
export function coalLoadingTaskListMenuApi(query) {
  return request({
    url: '/coking/CoalDelivery/getCoalLoadingTaskListMenu',
    method: 'get',
    params: query
  })
}

// 保存
export function saveCoalDeliverServiceApi(data) {
  return request({
    url: '/coking/CoalDeliveryInventoryMain/save',
    method: 'post',
    data: data
  })
}

// 提交
export function coalDeliverySubmitApi(data) {
  return request({
    url: '/coking/CoalDeliveryInventoryMain/submit',
    method: 'post',
    data: data
  })
}

// 解除提交
export function coalDeliveryCancelSubmitApi(id) {
  return request({
    url: '/coking/CoalDeliveryInventoryMain/cancelSubmit/' + id,
    method: 'post',
    data: null
  })
}

//上煤任务单
export function selectCoalLoadingTaskListByRunIdForDeliveryApi(query) {
  return request({
    url: '/coking/coalLoadingTaskList/selectCoalLoadingTaskListByRunIdForDelivery',
    method: 'get',
    params: query
  })
}
