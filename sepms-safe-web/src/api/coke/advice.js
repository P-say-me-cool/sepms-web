import request from '@/utils/request'

// 燃烧室温度测量查询
export function findThermalAdviceList(query) {
  return request({
    url: '/coking/coke/standard/thermalAdvice',
    method: 'post',
    params: query
  })
}
