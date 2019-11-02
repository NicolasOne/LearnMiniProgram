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
// 点赞
export function thumbUp(commentId) {
  return request({
    url: "/share/giveLike",
    data: {
      commentId,
    }
  })
}
// 添加分享
export function addShare(file, level, cityCode, locationIndex, shareContent, tagId) {
  return request({
    url: "/share/share",
    data: {
      file,
      level,
      cityCode,
      locationIndex,
      shareContent,
      tagId
    }
  })
}