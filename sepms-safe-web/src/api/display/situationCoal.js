import request from '@/utils/request'

//查询煤堆盘库近十天库存量
export function selectHeapInventory(query) {
  return request({
    url: '/coking/situationCoal/selectHeapInventory',
    method: 'get',
    params: query
  })
}

//查询单仓库存
export function selectSingleWarehouseMeasure(query) {
  return request({
    url: '/coking/situationCoal/selectSingleWarehouseMeasure',
    method: 'get',
    params: query
  })
}
