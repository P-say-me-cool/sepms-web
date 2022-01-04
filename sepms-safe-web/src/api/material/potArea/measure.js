import request from '@/utils/request'

// 查询罐检尺列表
export function listMeasure(query) {
  return request({
    url: '/material/measure/list',
    method: 'get',
    params: query
  })
}

// 根据工厂id查询罐初始化数据
export function getPotInfoNotUnitId(query) {
  return request({
    url: '/material/measure/getPotInfoNotUnitId',
    method: 'get',
    params: query
  })
}

// 根据工厂id查询罐初始化数据
export function getPotMaterialByUnitId(query) {
  return request({
    url: '/material/measure/getPotMaterialByUnitId',
    method: 'get',
    params: query
  })
}

// 查询罐收付列表
export function getPotInfoListByUnitId(query) {
  return request({
    url: '/material/measure/potInfoListByUnitId',
    method: 'get',
    params: query
  })
}

// 数采
export function getNumberOfMining(query) {
  return request({
    url: '/material/measure/getNumberOfMining',
    method: 'get',
    params: query
  })
}

// 封账提交
export function submit(data) {
  return request({
    url: '/material/measure/submit',
    method: 'post',
    data: data
  })
}

// 封账解除
export function submitRemove(data) {
  return request({
    url: '/material/measure/submitRemove',
    method: 'post',
    data: data
  })
}

// 批量数采
export function getBatchNumberOfMining(data) {
  return request({
    url: '/material/measure/getBatchNumberOfMining',
    method: 'post',
    data: data
  })
}

// 计算
export function getPotCalculate(data) {
  return request({
    url: '/material/measure/potCalculate',
    method: 'post',
    data: data
  })
}

// 计算
export function getBatchPotCalculate(data) {
  return request({
    url: '/material/measure/batchPotCalculate',
    method: 'post',
    data: data
  })
}

// 查询罐检尺列表
export function getPotInfoList(query) {
  return request({
    url: '/material/measure/potInfoList',
    method: 'get',
    params: query
  })
}

// 查询罐检尺详细
export function getMeasure(id) {
  return request({
    url: '/material/measure/' + id,
    method: 'get'
  })
}

// 新增罐信息
export function addPotInfo(data) {
  return request({
    url: '/material/measure/addPotInfo',
    method: 'post',
    data: data
  })
}

// 新增罐检尺
export function addPotScaleMeasure(data) {
  return request({
    url: '/material/measure/addPotScaleMeasure',
    method: 'post',
    data: data
  })
}

// 新增罐检尺
export function addBatchPotScaleMeasure(data) {
  return request({
    url: '/material/measure/addBatchPotScaleMeasure',
    method: 'post',
    data: data
  })
}


// 修改罐检尺
export function updateMeasure(data) {
  return request({
    url: '/material/measure',
    method: 'put',
    data: data
  })
}

// 删除罐检尺
export function delMeasure(id) {
  return request({
    url: '/material/measure/' + id,
    method: 'delete'
  })
}
