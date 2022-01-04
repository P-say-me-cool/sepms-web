import request from '@/utils/request'

// 查询工艺指标列表
export function listIndicatorsShow(query) {
  return request({
    url: '/operation/indicatorsShow/list',
    method: 'get',
    params: query
  })
}

// 查询工艺指标趋势图
export function listIndicatorsChars(query) {
  return request({
    url: '/operation/indicatorsShow/chars',
    method: 'post',
    data: query
  })
}


export function listIndicatorsCharsList(query) {
  return request({
    url: '/operation/indicatorsShow/charsList',
    method: 'post',
    data: query
  })
}
