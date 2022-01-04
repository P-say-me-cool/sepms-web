import request from '@/utils/request'

// 罐区列表
export function areaList() {
  return request({
    url: '/model/modeltree/areaList',
    method: 'get'
  })
}

//查询介质
export function energyMedium(){
  return request({
    url: '/model/energy/selectList',
    method: 'get'
  })
}

// 查询列表
export function listMeter(query) {
  return request({
    url: '/energy/energymeter/list',
    method: 'get',
    params: query
  })
}

// 查询详细
export function getMeter(id) {
  return request({
    url: '/energy/energymeter/' + id,
    method: 'get'
  })
}

// 保存
export function addMeter(data) {
  return request({
    url: '/energy/energymeter',
    method: 'post',
    data: data
  })
}

//提交
export function submitMeter(data) {
  return request({
    url: '/energy/energymeter/submit',
    method: 'put',
    data: data
  })
}

//解除提交
export function unSubmitMeter(data) {
  return request({
    url: '/energy/energymeter/unSubmit',
    method: 'put',
    data: data
  })
}

// 删除
export function delMeter(data) {
  return request({
    url: '/energy/energymeter/delete',
    method: 'delete',
    data: data
  })
}
