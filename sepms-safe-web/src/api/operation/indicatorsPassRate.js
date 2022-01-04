import request from '@/utils/request'

// 查询工艺指标合格率列表
export function listIndicatorsPassRate(query) {
  return request({
    url: '/operation/indicatorsPassRate/list',
    method: 'get',
    params: query
  })
}

