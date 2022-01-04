import request from '@/utils/request'

// 查询节点期间量数据列表
export function listNodedatasumm(query) {
  return request({
    url: '/system/nodedatasumm/list',
    method: 'get',
    params: query
  })
}

// 查询节点期间量数据详细
export function getNodedatasumm(id) {
  return request({
    url: '/system/nodedatasumm/' + id,
    method: 'get'
  })
}

// 新增节点期间量数据
export function addNodedatasumm(data) {
  return request({
    url: '/system/nodedatasumm',
    method: 'post',
    data: data
  })
}

// 修改节点期间量数据
export function updateNodedatasumm(data) {
  return request({
    url: '/system/nodedatasumm',
    method: 'put',
    data: data
  })
}

// 删除节点期间量数据
export function delNodedatasumm(id) {
  return request({
    url: '/system/nodedatasumm/' + id,
    method: 'delete'
  })
}
