import request from "@/utils/request";

export function analysisApi(query) {
  return request({
    url: '/material/analysis/initAnalysis/',
    method: 'get',
    params: query
  })
}

export function selectAnalysisApi(query) {
  return request({
    url: '/material/analysis/list',
    method: 'get',
    params: query
  })
}

export function submitAnalysis(data) {
  return request({
    url: '/material/analysis/submitAnalysis',
    method: 'post',
    data: data
  })
}

export function unSubmitAnalysis(data) {
  return request({
    url: '/material/analysis/unSubmitAnalysis',
    method: 'post',
    data: data
  })
}
