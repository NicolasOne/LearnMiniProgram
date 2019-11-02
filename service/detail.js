import request from './network.js'

export function getDetailData(shareId) {
  return request({
    url: "/share/getShareDetailInfo",
    data: {
      shareId
    }
  })
}
// 保存评论信息
export function saveCommentData(shareId,comment) {
  return request({
    url: "/comment/comment",
    method: 'post',
    data: {
      shareId,
      comment
    }
  })
}
// 获取点赞数
export function getLikeCount(shareId) {
  return request({
    url: "/share/getLikeCount",
    method: 'post',
    data: {
      shareId
    }
  })
}