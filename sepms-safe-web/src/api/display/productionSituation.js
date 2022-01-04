import request from '@/utils/request'

/*园区概览*/
export function getParkProductionOverview() {
  return request({
    url: '/coking/productionSituation/parkProductionOverview',
    method: 'get',
  })
}

/*焦炉生产情况*/
export function getCokeProductionSituation() {
  return request({
    url: '/coking/productionSituation/cokeProductionSituation',
    method: 'get',
  })
}

/*K线图*/
export function getKLine(name) {
  return request({
    url: '/coking/productionSituation/kLine?name='+name,
    method: 'get',
  })
}
/*生产情况*/
export function getProductValue() {
  return request({
    url: '/coking/productionSituation/getProductValue',
    method: 'get',
  })
}
/*装置负荷*/
export function getEquipmentValue() {
  return request({
    url: '/coking/productionSituation/getEquipmentValue',
    method: 'get',
  })
}
