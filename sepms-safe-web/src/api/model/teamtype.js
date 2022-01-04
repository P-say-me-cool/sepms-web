import request from '@/utils/request'

// 查询班组类别列表
export function listTeamtype(query) {
  return request({
    url: '/model/teamtype/list',
    method: 'get',
    params: query
  })
}

// 查询班组类别列表
export function selectListTeamtype(query) {
  return request({
    url: '/model/teamtype/selectList',
    method: 'get',
    params: query
  })
}
// 查询班组类别列表
export function getClassesByWorkshopId(query) {
  return request({
    url: '/model/teamtype/getClassesByWorkshopId',
    method: 'get',
    params: query
  })
}
// 登录用户查询班组类别列表
export function getClassesByUserInfo() {
  return request({
    url: '/model/teamtype/getClassesByUserInfo',
    method: 'get'
  })
}

// 查询上个班的班次信息
export function getBeforeClassesByWorkshopId(query) {
  return request({
    url: '/model/teamtype/getBeforeClassesByWorkshopId',
    method: 'get',
    params: query
  })
}

// 查询班组类别列表
export function selectUserList(query) {
  return request({
    url: '/model/teamtype/selectUserList',
    method: 'get',
    params: query
  })
}

// 查询班组类别详细
export function getTeamtype(id) {
  return request({
    url: '/model/teamtype/' + id,
    method: 'get'
  })
}

export function getTeamtypeDetail(id) {
  return request({
    url: '/model/teamtype/detail/' + id,
    method: 'get'
  })
}

// 新增班组类别
export function addTeamtype(data) {
  return request({
    url: '/model/teamtype',
    method: 'post',
    data: data
  })
}

// 修改班组类别
export function updateTeamtype(data) {
  return request({
    url: '/model/teamtype',
    method: 'put',
    data: data
  })
}

// 删除班组类别
export function delTeamtype(id) {
  return request({
    url: '/model/teamtype/' + id,
    method: 'delete'
  })
}

// 查询当前用户班组信息
export function getTeamTypeInfo() {
  return request({
    url: '/model/teamtype/getTeamTypeInfo',
    method: 'get'
  })
}

// 根据用户id删除
export function deletePmTeamPersonByPersonId(personId) {
  return request({
    url: '/model/teamtype/deletePmTeamPersonByPersonId/'+personId,
    method: 'get'
  })
}

// 根据班组id查询
export function getPersonByTeamId(teamId) {
  return request({
    url: '/model/teamtype/getPersonByTeamId/'+teamId,
    method: 'get'
  })
}

//查询可用人员
export function getAbleUser(query) {
  return request({
    url: '/model/teamtype/getAbleUser',
    method: 'get',
    params: query
  })
}

//添加人员
export function addPerson(data) {
  return request({
    url: '/model/teamtype/addPerson',
    method: 'post',
    data: data
  })
}
