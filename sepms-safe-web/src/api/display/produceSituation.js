import request from '@/utils/request'

export function getStore(storeName) {
  return request({
    url: '/coking/produceSituation/listStore?storeName='+storeName,
    method: 'get',
  })
}

export function saleCount() {
  return request({
    url: '/coking/produceSituation/produceInfo',
    method: 'get'
  })
}

export function rightUp() {
  return request({
    url: '/coking/produceSituation/rightUp',
    method: 'get'
  })
}
