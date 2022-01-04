import request from '@/utils/request'

// 煤堆盘库  展示主页面数据
export function coalHeapInventoryNameApi(query) {
  return request({
    url: '/coking/web/CoalHeapInventory/selectCoalHeapInventory',
    method: 'get',
    params: query
  })
}

// 管理合垛  展示页面数据
export function inventoryDetailsByIdApi(coalHeapId) {
  return request({
    url: '/coking/web/CoalHeapInventory/inventoryDetails?coalHeapId=' + coalHeapId,
    method: 'get'
  })
}

//煤种  展示页面数据
export function getMaterialApi(query) {
  return request({
    url: '/coking/web/CoalHeapInventory/getMaterial',
    method: 'get',
    params: query
  })
}

//删除
export function deleteMaterialApi(id) {
  return request({
    url: '/coking/web/CoalHeapInventory/deleteMaterial?id=' + id,
    method: 'get'
  })
}

// 合垛操作  添加
export function saveMaterialApi(data) {
  return request({
    url: '/coking/web/CoalHeapInventory/saveMaterial',
    method: 'post',
    data: data
  })
}

// 保存盘库  编辑
export function saveHeapInventoryApi(data) {
  return request({
    url: '/coking/web/CoalHeapInventory/saveHeapInventory',
    method: 'post',
    data: data
  })
}

// 计算和垛百分比
export function percentageApi(data) {
  return request({
    url: '/coking/web/CoalHeapInventory/percentage',
    method: 'post',
    data: data
  })
}

// 提交
export function coalHeapInventorySubmitApi(data) {
  return request({
    url: '/coking/web/CoalHeapInventory/submit',
    method: 'post',
    data: data
  })
}

// 解除提交
export function coalHeapInventoryCancelSubmitApi(data) {
  return request({
    url: '/coking/web/CoalHeapInventory/cancelSubmit',
    method: 'post',
    data: data
  })
}

