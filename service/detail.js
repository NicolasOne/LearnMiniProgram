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
// 获取分享点赞数
export function getLikeCount(shareId) {
  return request({
    url: "/share/getLikeCount",
    method: 'post',
    data: {
      shareId
    }
  })
}
// 评论点赞
export function giveLike(commentId) {
  return request({
    url: "/comment/giveLike",
    data: {
      commentId
    }
  })
}
// 获取评论的回复
export function getReply(commentId) {
  return request({
    url: "/comment/getReply",
    data: {
      commentId
    }
  })
}