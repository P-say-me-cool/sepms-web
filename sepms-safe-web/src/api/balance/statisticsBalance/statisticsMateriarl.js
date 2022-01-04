import request from '@/utils/request'

// 查询统计平衡物料汇总列表
export function listStatisticsMateriarl(query) {
  return request({
    url: '/material/statisticsMateriarl/list',
    method: 'get',
    params: query
  })
}

// 焦油收率
export function getCokeOilRatioDetail(query) {
  return request({
    url: '/material/statisticsMateriarl/getCokeOilRatioDetail',
    method: 'get',
    params: query
  })
}

// 吨焦外供煤气
export function getBenZolCokeRatioDetail(query) {
  return request({
    url: '/material/statisticsMateriarl/getBenZolCokeRatioDetail',
    method: 'get',
    params: query
  })
}

// 脱笨装置出
export function getTakeOffYourStupidDeviceDetail(query) {
  return request({
    url: '/material/statisticsMateriarl/getTakeOffYourStupidDeviceDetail',
    method: 'get',
    params: query
  })
}


// 修改煤气消耗量
export function updateTakeOffYourStupidDeviceDetailOutConfirm(data) {
  return request({
    url: '/material/statisticsMateriarl/updateTakeOffYourStupidDeviceDetailOutConfirm',
    method: 'post',
    data: data
  })
}
// 焦仓出厂
export function getCokeWarehouseToInOutDetail(query) {
  return request({
    url: '/material/statisticsMateriarl/getCokeWarehouseToInOutDetail',
    method: 'get',
    params: query
  })
}



// 焦油收率
export function getCokeOilOutDetail(query) {
  return request({
    url: '/material/statisticsMateriarl/getCokeOilOutDetail',
    method: 'get',
    params: query
  })
}

// 查询统计平衡物料汇总列表
export function getInOutToCoalHeapDetail(query) {
  return request({
    url: '/material/statisticsMateriarl/getInOutToCoalHeapDetail',
    method: 'get',
    params: query
  })
}



// 查询统计平衡物料（按照流程节点分组统计）
export function listGroupByProcessId(query) {
  return request({
    url: '/material/statisticsMateriarl/listGroupByProcessId',
    method: 'get',
    params: query
  })
}

// 根据煤场物料分组
export function getGroupByCoalHeapAndMaterial(query) {
  return request({
    url: '/material/statisticsMateriarl/getGroupByCoalHeapAndMaterial',
    method: 'get',
    params: query
  })
}

// 根据配煤物料分组
export function getGroupByCoalBlendingAndMaterial(query) {
  return request({
    url: '/material/statisticsMateriarl/getGroupByCoalBlendingAndMaterial',
    method: 'get',
    params: query
  })
}

// 根据煤场分组
export function getGroupByCoalHeap(query) {
  return request({
    url: '/material/statisticsMateriarl/getGroupByCoalHeap',
    method: 'get',
    params: query
  })
}

// 根据煤场分组
export function getCoalHeadOutDetail(query) {
  return request({
    url: '/material/statisticsMateriarl/getCoalHeadOutDetail',
    method: 'get',
    params: query
  })
}

// 查询统计平衡物料（按照流程节点分组统计）
export function materialSum(query) {
  return request({
    url: '/material/statisticsMateriarl/materialSum',
    method: 'get',
    params: query
  })
}

// 查询统计平衡物料（按照流程节点,物料分组统计）
export function listGroupByProcessIdAndMateriarl(query) {
  return request({
    url: '/material/statisticsMateriarl/listGroupByProcessIdAndMateriarl',
    method: 'get',
    params: query
  })
}

// 汇总统计平衡物料
export function listStatisticsMateriarlSum(query) {
  return request({
    url: '/material/statisticsMateriarl/sum',
    method: 'get',
    params: query
  })
}

// 综合煤焦比
export function getCoalCokeDetail(query) {
  return request({
    url: '/material/statisticsMateriarl/getCoalCokeDetail',
    method: 'get',
    params: query
  })
}

// 煤塔详情
export function getCoalTowerDetail(query) {
  return request({
    url: '/material/statisticsMateriarl/getCoalTowerDetail',
    method: 'get',
    params: query
  })
}

// 综合煤焦比 原煤消耗详情
export function getCoalTowerInMaterialDetail(query) {
  return request({
    url: '/material/statisticsMateriarl/getCoalTowerInMaterialDetail',
    method: 'get',
    params: query
  })
}

// 煤塔物料期初详情
export function getMaterialCoalTowerStartDetail(query) {
  return request({
    url: '/material/statisticsMateriarl/getMaterialCoalTowerStartDetail',
    method: 'get',
    params: query
  })
}

// 煤塔物料期末详情
export function getMaterialCoalTowerEndDetail(query) {
  return request({
    url: '/material/statisticsMateriarl/getMaterialCoalTowerEndDetail',
    method: 'get',
    params: query
  })
}

// 煤塔物料期末详情
export function getCokeOutDetail(query) {
  return request({
    url: '/material/statisticsMateriarl/getCokeOutDetail',
    method: 'get',
    params: query
  })
}

// 煤塔配煤消耗详情
export function getMaterialCoalTowerDetail(query) {
  return request({
    url: '/material/statisticsMateriarl/getMaterialCoalTowerDetail',
    method: 'get',
    params: query
  })
}

// 查询冷鼓装置的进
export function getColdDrumGearInQuantity(query) {
  return request({
    url: '/material/statisticsMateriarl/getColdDrumGearInQuantity',
    method: 'get',
    params: query
  })
}

// 查询统计平衡物料汇总详细
export function getStatisticsMateriarl(id) {
  return request({
    url: '/material/statisticsMateriarl/' + id,
    method: 'get'
  })
}

// 新增统计平衡物料汇总
export function addStatisticsMateriarl(data) {
  return request({
    url: '/material/statisticsMateriarl',
    method: 'post',
    data: data
  })
}

// 修改汽运进场量
export function updateCarInQuantityConfirm(data) {
  return request({
    url: '/material/statisticsMateriarl/updateCarInQuantityConfirm',
    method: 'post',
    data: data
  })
}

// 修改吨焦外供煤气
export function updateBenZolCokeRatioDetail(data) {
  return request({
    url: '/material/statisticsMateriarl/updateBenZolCokeRatioDetail',
    method: 'post',
    data: data
  })
}

// 修改焦仓汽运进场量
export function updateCarOutQuantityConfirm(data) {
  return request({
    url: '/material/statisticsMateriarl/updateCarOutQuantityConfirm',
    method: 'post',
    data: data
  })
}

// 修改焦油产量
export function updateCokeOilRatioDetail(data) {
  return request({
    url: '/material/statisticsMateriarl/updateCokeOilRatioDetail',
    method: 'post',
    data: data
  })
}


// 修改冷鼓装置进场
export function updateColdDrumGearInQuantityConfirm(data) {
  return request({
    url: '/material/statisticsMateriarl/updateColdDrumGearInQuantityConfirm',
    method: 'post',
    data: data
  })
}

// 修改焦油出
export function updateCokeOilOutDetailConfirm(data) {
  return request({
    url: '/material/statisticsMateriarl/updateCokeOilOutDetailConfirm',
    method: 'post',
    data: data
  })
}


// 修改焦炭确认量
export function updateCokeOutDetailConfirm(data) {
  return request({
    url: '/material/statisticsMateriarl/updateCokeOutDetailConfirm',
    method: 'post',
    data: data
  })
}

// 修改原煤消耗
export function updateCoalTowerInMaterialDetail(data) {
  return request({
    url: '/material/statisticsMateriarl/updateCoalTowerInMaterialDetail',
    method: 'post',
    data: data
  })
}


// 修改火运进场量
export function updateTrainInQuantityConfirm(data) {
  return request({
    url: '/material/statisticsMateriarl/updateTrainInQuantityConfirm',
    method: 'post',
    data: data
  })
}

// 修改焦仓火运进场量
export function updateTrainOutQuantityConfirm(data) {
  return request({
    url: '/material/statisticsMateriarl/updateTrainOutQuantityConfirm',
    method: 'post',
    data: data
  })
}

//修改煤场出库量
export function updateCoalHeapOutQuantityConfirm(data) {
  return request({
    url: '/material/statisticsMateriarl/updateCoalHeapOutQuantityConfirm',
    method: 'post',
    data: data
  })
}

// 修改统计平衡物料汇总
export function updateStatisticsMateriarl(data) {
  return request({
    url: '/material/statisticsMateriarl',
    method: 'put',
    data: data
  })
}

// 更新统计平衡封账状态
export function updateStatus(data) {
  return request({
    url: '/material/statisticsMateriarl/updateStatus',
    method: 'put',
    data: data
  })
}

// 删除统计平衡物料汇总
export function delStatisticsMateriarl(id) {
  return request({
    url: '/material/statisticsMateriarl/' + id,
    method: 'delete'
  })
}
