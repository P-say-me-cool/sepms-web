import request from '@/utils/request'

// 获取移动列表
export function coalHeapMoveRecordSelectApi() {
  return request({
    url: '/coking/CoalHeapMoveRecord/selectList',
    method: 'get'
  })
}

// 煤堆的移动
export function moveCoalHeapApi(data) {
  return request({
    url: '/coking/CoalHeapMoveRecord/moveCoalHeap',
    method: 'post',
    data: data
  })
}
