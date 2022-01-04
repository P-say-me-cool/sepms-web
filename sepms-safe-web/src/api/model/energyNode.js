import request from '@/utils/request'

// 查询能源节点列表
export function listEnergyNode(query) {
  return request({
    url: '/model/energyNode/list',
    method: 'get',
    params: query
  })
}

// 查询全部能源节点列表
export function listEnergyNodeAll(query) {
  return request({
    url: '/model/energyNode/listAll',
    method: 'get',
    params: query
  })
}

// 查询能源节点详细
export function getEnergyNode(id) {
  return request({
    url: '/model/energyNode/' + id,
    method: 'get'
  })
}

// 新增能源节点
export function addEnergyNode(data) {
  return request({
    url: '/model/energyNode',
    method: 'post',
    data: data
  })
}

// 修改能源节点
export function updateEnergyNode(data) {
  return request({
    url: '/model/energyNode',
    method: 'put',
    data: data
  })
}

// 删除能源节点
export function delEnergyNode(id) {
  return request({
    url: '/model/energyNode/' + id,
    method: 'delete'
  })
}
