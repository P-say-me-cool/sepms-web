import request from '@/utils/request'

//信息列表班组连锁投用率
export function listClassCtrlChain(data) {
  return request({
    url: '/operation/classCtrlChain/listTeam',
    method: 'post',
    data: data
  })
}

//信息列表班组连锁投用率
export function listClassCtrlChainDetail(data) {
  return request({
    url: '/operation/classCtrlChain/listClass',
    method: 'post',
    data: data
  })
}

export function listThird(indId) {
  return request({
    url: '/operation/classCtrlChain/' + indId,
    method: 'get'
  })
}
