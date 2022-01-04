import request from '@/utils/request'

// 燃烧室温度测量查询
export function combustorOcQuery(query) {
  return request({
    url: '/coking/coke/standard/combustorOcQuery',
    method: 'post',
    params: query
  })
}


// 查询生效热工标准
export function effectThermalStandard(query) {
  return request({
    url: '/coking/coke/standard/effectThermalStandard',
    method: 'post',
    params: query
  })
}
