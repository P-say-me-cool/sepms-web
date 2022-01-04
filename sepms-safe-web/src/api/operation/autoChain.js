import request from '@/utils/request'

//查询table列表
export function selectAutoChain(data) {
  return request({
    url: '/operation/autoChain/list',
    method: 'get',
    params: data
  })
}

// 保存(addMutualSupplyInstrumentMeteringApi)
export function addAutoChain(data) {
  return request({
    url: '/operation/autoChain/add',
    method: 'post',
    data: data
  })
}
//修改
export function editAutoChain(data) {
  return request({
    url: '/operation/autoChain',
    method: 'put',
    data: data
  })
}
// 删除
export function delAutoChain(id) {
  return request({
    url: '/operation/autoChain/' + id,
    method: 'delete'
  })
}

