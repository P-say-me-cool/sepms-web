import request from '@/utils/request'

//查询班组合格率接口
export function listTeam(data) {
  return request({
    url: '/operation/teamGroup/listTeam',
    method: 'post',
    data: data
  })
}
//查询班次合格率接口
export function listClass(data) {
    return request({
      url: '/operation/teamGroup/listClass',
      method: 'post',
      data: data
    })
  }
listTeam
