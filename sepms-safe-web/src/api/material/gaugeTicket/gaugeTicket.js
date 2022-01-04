import request from '@/utils/request'

// 查询罐检尺列表
export function listGaugeTicket(query) {
  return request({
    url: '/material/gaugeTicket/list',
    method: 'get',
    params: query
  })
}
