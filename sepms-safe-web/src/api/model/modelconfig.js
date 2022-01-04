import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";


// 查询模型配置列表
export function listModeltree(query) {
  return request({
    url: '/model/modeltree/list',
    method: 'get',
    params: query
  })
}



