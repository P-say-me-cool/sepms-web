import request from '@/utils/request'

//根据日期 班次 工厂查询移动缺失数据
export function moveDefectListApi(query){
  return request({
    url:'/material/moveDefect/list',
    method:'get',
    params:query
  })
}
