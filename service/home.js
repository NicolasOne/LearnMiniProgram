import request from './network.js'

// 获取轮播图
export function getBannerData() {
  return request({
    url: '/share/getBanner'
  })
}
// 获取分享列表
export function getShareListData(type, currPage) {
  return request({
    url: "/share/getShareList",
    data:{
      type,
      currPage
    }
  })
}
// 分享点赞
export function thumbUp(commentId) {
  return request({
    url: "/share/giveLike",
    data: {
      commentId,
    }
  })
}
// 添加分享
export function addShare(cityCode, locationIndex, shareContent, tagId, imgList) {
  return request({
    url: "/share/share",
    method: 'POST',
    data: {
      cityCode,
      locationIndex,
      shareContent,
      tagId,
      imgPath:imgList
    }
  })
}
// 获取标签列表
export function getTagList() {
  return request({
    url: "/tag/getTagInfo",
    data: {}
  })
}
// 获取相似卡片
export function getSameCard(name, cityCode, center) {
  return request({
    url: "/card/getSameCard",
    data: {
      name,
      cityCode,
      center
    },
    method: 'POST',
  })
}
// 生成卡片
export function generate(shareId, name, detail, center, cityCode, imgs) {
  return request({
    url: "/card/generate",
    data: {
      shareId,
      name,
      detail,
      center,
      cityCode,
      imgs
    },
    method: 'POST',
  })
}
