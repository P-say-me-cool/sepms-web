import request from '@/utils/request'

// 查询煤堆  渲染主页面
export function coalHeapNameApi(query) {
  return request({
    url: '/coking/web/CoalHeap/selectCoalHeapDefinition',
    method: 'get',
    params: query
  })
}

// 查询煤堆  添加
export function coalHeapNameAddApi(data) {
  return request({
    url: '/coking/web/CoalHeap/saveCoalHeap',
    method: 'post',
    data: data
  })
}

// 获取煤场  下拉框
export function coalSpaceSelectApi() {
  return request({
    url: '/coking/web/CoalHeap/getCoalSpace',
    method: 'get'
  })
}

// 获取煤种  下拉框 y
export function selectMaterialApi() {
  return request({
    url: '/coking/web/CoalHeap/selectMaterial',
    method: 'get'
  })
}

// 根据供应商名称搜索 供应商 列表 Y
export function getTraderApi(query) {
  return request({
    url: '/coking/web/CoalHeap/getTrader',
    method: 'get',
    params: query
  })
}

// 删除
export function deleteById(id) {
  return request({
    url: '/coking/web/CoalHeap/deleteById?id=' + id,
    method: 'get'
  })
}

// ----------
//移动
// 煤堆的移动
export function moveCoalHeapApi(data) {
  return request({
    url: '/coking/web/CoalHeapMoveLog/moveCoalHeap',
    method: 'post',
    data: data
  })
}

// 查询类型 下拉框
export function getTypeApi() {
  return request({
    url: '/coking/web/CoalHeap/getType',
    method: 'get'
  })
}

// 根据移动类型，获取煤堆数据
export function selectCoalHeapByTypeApi(query) {
  return request({
    url: '/coking/web/CoalInWarehouse/selectCoalHeapByType',
    method: 'get',
    params: query
  })
}

// 查询煤场信息（权限）
export function selectCoalSpaceApi() {
  return request({
    url: '/coking/web/CoalHeap/selectCoalSpaceList',
    method: 'get',
  })
}
