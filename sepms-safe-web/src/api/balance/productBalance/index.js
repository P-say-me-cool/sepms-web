import request from "@/utils/request";

export function startBalance(query){
    return request({
      url:'/material/balance/startBalance',
      method:'get',
      params:query
    })
}

export function selectBalance(query){
    return request({
      url:'/material/balance/selectBalance',
      method:'get',
      params:query
    })
}

//查询执行时间
export function getExecuteTime(query){
  return request({
    url:'/material/PdBalanceMain/selectExecuteTimeList',
    method:'get',
    params:query
  })
}

//提交生产平衡结果
export function submitBalance(data) {
  return request({
    url: '/material/PdBalanceMain/submitBalance',
    method: 'post',
    data: data
  })
}

//解除提交生产平衡结果
export function unSubmitBalance(data) {
  return request({
    url: '/material/PdBalanceMain/unSubmitBalance',
    method: 'post',
    data: data
  })
}

//继续平衡
export function goOnBalance(data) {
  return request({
    url: '/material/balance/goOnBalance',
    method: 'post',
    data: data
  })
}

