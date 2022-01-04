import request from '@/utils/request'

// 查询调度指令列表
export function listScheduleinstructioninfo(query) {
  return request({
    url: '/system/scheduleinstructioninfo/list',
    method: 'get',
    params: query
  })
}

// 查询调度指令详细
export function getScheduleinstructioninfo(id) {
  return request({
    url: '/system/scheduleinstructioninfo/' + id,
    method: 'get'
  })
}
// 新增调度指令
export function addScheduleinstructioninfo(data) {
  return request({
    url: '/system/scheduleinstructioninfo',
    method: 'post',
    data: data
  })
}

// 修改调度指令
export function updateScheduleinstructioninfo(data) {
  return request({
    url: '/system/scheduleinstructioninfo',
    method: 'put',
    data: data
  })
}

// 删除调度指令
export function delScheduleinstructioninfo(id) {
  return request({
    url: '/system/scheduleinstructioninfo/' + id,
    method: 'delete'
  })
}


// 查询班组类别列表
export function listTeamtype(query) {
  return request({
    url: '/model/teamtype/listPmTeamType',
    method: 'get',
    params: query
  })
}

export function closedScheduleinstructioninfo(id){
  return request({
    url: '/system/scheduleinstructioninfo/closed/' + id,
    method: 'get'
  })
}

// 删除文件
export function deleteFileById(id) {
  return request({
    url: '/system/scheduleinstructioninfo/delete/' + id,
    method: 'get'
  })
}

// 下载文件
export function downLoadFileByURL(query) {
  return request({
    url: '/system/scheduleinstructioninfo/downLoadFile',
    method: 'get',
    params: query,
    responseType: 'blob',
    timeout: 1000*60*5
  })
}

// 接令组下拉菜单
export function listDropDown(query) {
  return request({
    url: '/system/receiveGroupConfig/listDropDown',
    method: 'get'
  })
}
