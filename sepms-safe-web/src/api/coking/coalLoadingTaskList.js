import request from '@/utils/request'

// 查询上煤任务单列表
export function coalLoadingTaskListApi(query) {
  return request({
    url: '/coking/coalLoadingTaskList/list',
    method: 'get',
    params: query
  })
}

//  弹出框
export function getTaskCodeApi(query) {
  return request({
    url: '/coking/coalLoadingTaskList/getTaskCode',
    method: 'get',
    params: query
  })
}

// 弹出框保存
export function saveTaskListApi(body) {
  return request({
    url: '/coking/coalLoadingTaskList/saveTaskList',
    method: 'post',
    data: body
  })
}

// 删除上煤任务单
export function coalLoadingTaskListRemoveApi(id) {
  return request({
    url: '/coking/coalLoadingTaskList/remove?taskId=' + id,
    method: 'get'
  })
}

// 审核
export function coalLoadingTaskListExamineApi(ids) {
  return request({
    url: '/coking/coalLoadingTaskList/examine?taskId=' + ids,
    method: 'get'
  })
}

// 根据配煤装置查询上煤任务单 //搜索
export function selectCoalLoadingTaskListByCoalBlendingIdApi(coalBlendingId) {
  return request({
    url: '/coking/coalLoadingTaskList/selectCoalLoadingTaskListByCoalBlendingId?coalBlendingId=' + coalBlendingId,
    method: 'get'
  })
}

// 根据配煤装置查询配煤执行单下拉菜单  //新增
export function selectListRunCodeByCoalBlendingIdApi(coalBlendingId) {
  return request({
    url: '/coking/coalLoadingTaskList/selectListRunCodeByCoalBlendingId?coalBlendingId=' + coalBlendingId,
    method: 'get'
  })
}

// 根据配煤装置查询配煤执行单下拉菜单  //新增
export function CoalLoadingApi(renwunum) {
  return 'http://10.32.1.97:8080/WebReport/decision/view/report?viewlet=MES_NEW%252Fshangmeirenwu.cpt&ref_t=design&op=view&ref_c=583cd3a5-bac0-4dfa-9e8a-1e5ab36337fb&renwunum=' + renwunum
}
