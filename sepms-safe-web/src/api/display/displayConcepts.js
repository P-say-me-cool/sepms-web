import request from '@/utils/request'
export default{
  planData() {
    return request({
      url: '/coking/generalView/planData',
      method: 'get',
    })
  },
  receivePer(){
    return request({
      url: '/coking/generalView/receivePer',
      method: 'get',
    })
  },
  storeH() {
    return request({
      url: '/coking/generalView/storeH',
      method: 'get',
    })
  },
  coalStore() {
    return request({
      url: '/coking/generalView/coalStore',
      method: 'get',
    })
  },
  jiaoTanStore() {
    return request({
      url: '/coking/generalView/jiaoTanStore',
      method: 'get',
    })
  },
  jiaoOut() {
    return request({
      url: '/coking/generalView/jiaoOut',
      method: 'get',
    })
  }
}

