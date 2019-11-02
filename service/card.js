import request from './network.js'

export function getCardListData(currPage, pageSize) {
  return request({
    url: "/card/search",
    data: {
      currPage,
      pageSize
    }
  })
}