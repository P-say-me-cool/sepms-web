import request from '@/utils/request'

// 查询装置监控列表
export function listDeviceMonitor(query) {
  return request({
    url: '/system/devicemonitor/list',
    method: 'get',
    params: query
  })
}

// 根据装置ID查询详细信息
export function getEchartsDatas(query) {
  return request({
    url: '/system/devicemonitor/echarts',
    method: 'get',
    params: query
  })
}


export function queryMonitorDetail(query){
  return request({
    url: '/system/devicemonitor/monitorlist',
    method: 'get',
    params: query
  })
}
