import request from '@/utils/request'

// 查询装置投入产出列表
export function listProduce(query) {
  return request({
    url: '/material/chemical/produce/list',
    method: 'get',
    params: query
  })
}

// 查询装置投入产出详细
export function getProduce(id) {
  return request({
    url: '/material/chemical/produce/' + id,
    method: 'get'
  })
}

// 新增装置投入产出
export function addProduce(data) {
  return request({
    url: '/material/chemical/produce',
    method: 'post',
    data: data
  })
}

// 修改装置投入产出
export function updateProduce(data) {
  return request({
    url: '/material/chemical/produce',
    method: 'put',
    data: data
  })
}

// 删除装置投入产出
export function delProduce(id) {
  return request({
    url: '/material/chemical/produce/' + id,
    method: 'delete'
  })
}


// 查询装置投入产出列表
export function queryList(query) {
  return request({
    url: '/material/chemical/produce/queryList',
    method: 'get',
    params: query
  })
}

// 提交装置投入产出列表
export function submit(query) {
  return request({
    url: '/material/chemical/produce/submit',
    method: 'post',
    data: query
  })
}

// 取消提交装置投入产出列表
export function removeSubmit(query) {
  return request({
    url: '/material/chemical/produce/removeSubmit',
    method: 'post',
    data: query
  })
}

// 计算
export function calculate(query) {
  return request({
    url: '/material/chemical/produce/calculate',
    method: 'post',
    data: query
  })
}

// 修改侧线原始量计算操作
export function pipeCalculate(query) {
  return request({
    url: '/material/chemical/produce/pipeCalculate',
    method: 'post',
    data: query
  })
}
