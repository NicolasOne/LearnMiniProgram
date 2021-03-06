import request from './network.js'

export function getCardListData(currPage, pageSize, searchValue, areaCode) {
  console.log(searchValue,'searchValuesearchValue')
  let data = {
    currPage,
    pageSize,
    areaCode, name: searchValue}
  if(!searchValue){
    data = {
      currPage,
      pageSize,
      areaCode
    }
  }
  if(!areaCode){
    data = {
      currPage,
      pageSize,
      name: searchValue
    }
  }
  if(!areaCode&&!searchValue){
    data = {
      currPage,
      pageSize
    }
  }
  return request({
    url: "/card/search",
    data
  })
}
// 收藏卡片
export function collectCard(cardId) {
  return request({
    url: "/card/collectCard?cardId="+cardId,
    method: 'POST',
    data: {}
  })
}
// 已发布的卡片列表by地区
export function getMyCardDetailByArea(areaCode) {
  return request({
    url: "/card/getMyCardDetailByArea",
    method: 'POST',
    data: {
      areaCode
    },
  })
}
// 取消收藏卡片
export function unCollectCard(cardId) {
  return request({
    url: "/card/unCollectCard?cardId=" + cardId,
    method: 'POST',
    data: {}
  })
}
// 获取发布的卡片
export function getMyCardByArea(currPage, pageSize) {
  return request({
    url: "/card/getMyCardByArea",
    data: {
      currPage,
      pageSize
    },
    method: 'POST',
  })
}
// 获取收藏的卡片
export function getCollectCard(currPage, pageSize, name) {
  return request({
    url: "/card/getCollectCard",
    data: {
      currPage,
      pageSize,
      name
    },
    method: 'POST',
  })
}
// 获取卡片详情
export function getCardDetail(cardId) {
  return request({
    url: "/card/getCardDetail",
    data: {
      cardId
    }
  })
}
// 根据卡片获取相关分享
export function getShare(cardId, currPage) {
  return request({
    url: "/card/getShare",
    data: {
      cardId,
      currPage
    }
  })
}
// 根据商家列表
export function relevanceCard(shareId, cardId) {
  return request({
    url: "/card/relevanceCard",
    data: {
      shareId,
      cardId
    },
    method: 'POST'
  })
}
// 回复评论
export function reply(shareId, commentId, reply) {
  return request({
    url: "/comment/reply",
    data: {
      shareId,
      commentId,
      reply
    },
    method: 'POST'
  })
}