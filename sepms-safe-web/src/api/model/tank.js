import request from '@/utils/request'

// 查询装置-罐区装置列表
export function listTank(query) {
  return request({
    url: '/model/tank/list',
    method: 'get',
    params: query
  })
}

// 查询装置-罐区装置详细
export function getTank(id) {
  return request({
    url: '/model/tank/' + id,
    method: 'get'
  })
}

// 新增装置-罐区装置
export function addTank(data) {
  return request({
    url: '/model/tank',
    method: 'post',
    data: data
  })
}

// 修改装置-罐区装置
export function updateTank(data) {
  return request({
    url: '/model/tank',
    method: 'put',
    data: data
  })
}

// 删除装置-罐区装置
export function delTank(id) {
  return request({
    url: '/model/tank/' + id,
    method: 'delete'
  })
}
