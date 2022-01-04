import request from "@/utils/request";

//煤场库存
export function selectCoalHeapIndexData(query) {
  return request({
    url: '/coking/coalHeapInventory/coalHeapIndexData/',
    method: 'get',
    params: query
  })
}

//原煤入场
export function selectCoalInWarehouseIndexData(query) {
  return request({
    url: '/material/balance/coalInWarehouseIndexData/',
    method: 'get',
    params: query
  })
}

//配煤单仓
export function selectSingleWareHouseIndexData(query) {
  return request({
    url: '/material/balance/singleWareHouseIndexData/',
    method: 'get',
    params: query
  })
}

// 查询单仓测量列表
export function listSingleWarehouseMeasure(query) {
  return request({
    url: '/coking/SingleWarehouseMeasure/list',
    method: 'get',
    params: query
  })
}

//煤塔库存
export function selectCoalTowerMeasureIndexData(query) {
  return request({
    url: '/coking/CoalTowerMeasure/selectCoalTowerMeasureIndexData',
    method: 'get',
    params: query
  })
}

//焦炭出产
export function selectCokeProductionIndexData(query) {
  return request({
    url: '/material/balance/cokeProductionIndexData/',
    method: 'get',
    params: query
  })
}

//焦仓库存
export function selectCokeSiteInventoryIndexData(query) {
  return request({
    url: '/coking/inventory/selectCokeSiteInventoryIndexData',
    method: 'get',
    params: query
  })
}

//焦炭出厂
export function selectCokeFactoryIndexData(query) {
  return request({
    url: '/material/balance/cokeFactoryIndexData/',
    method: 'get',
    params: query
  })
}

//合成氨装置数据
export function selectAmmonialIndexData(query) {
  return request({
    url: '/material/measure/getAmmoniaIndexData/',
    method: 'get',
    params: query
  })
}

//甲醇装置物料数据
export function selectMethanolMaterialIndexData(query) {
  return request({
    url: '/material/measure/getMethanolMaterialIndexData/',
    method: 'get',
    params: query
  })
}

//甲醇装置日月数据
export function selectMethanolIndexData(query) {
  return request({
    url: '/material/balance/methanolIndexData/',
    method: 'get',
    params: query
  })
}

//化产品出厂日月数据
export function selectChemicalProductsIndexData(query) {
  return request({
    url: '/material/balance/chemicalProductsIndexData/',
    method: 'get',
    params: query
  })
}

//化产装置 净煤气发生量数据
export function getChemicalCleanGas(query) {
  return request({
    url: '/material/balance/chemicalCleanGas/',
    method: 'get',
    params: query
  })
}

//化产装置 硫酸洗油消耗量数据
export function getSulphuricWashIndexData(query) {
  return request({
    url: '/material/balance/sulphuricWashIndexData/',
    method: 'get',
    params: query
  })
}

//炼焦炉 荒煤气发生量数据
export function getRawGasIndexData(query) {
  return request({
    url: '/material/balance/rawGasIndexData/',
    method: 'get',
    params: query
  })
}

//炼焦炉 推焦计划实际量
export function getCokePushAndActualIndexData(query){
  return request({
    url: '/coking/coke/plan/pushAndActualIndexData/',
    method: 'get',
    params: query
  })
}

//炼焦炉 煤焦比等其他数据
export function getStoveOtherIndexData(query){
  return request({
    url: '/material/balance/stoveOtherIndexData/',
    method: 'get',
    params: query
  })
}
