// pages/commentDetail/commentDetail.js
import { getReply, giveLike } from '../../service/detail'
import { reply } from '../../service/card'
import { formatDateTimes } from '../../utils/utils.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemDetail:{},
    commentList:[],
    shareId:0,
    createTime:'',
    releaseFocus: true,
    isFouce: true,
    CommentLikedList:{},
    inputVal: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    this.setData({
      itemDetail: JSON.parse(options.itemDetail),
      shareId: options.shareId
    },() => {
      getReply(that.data.itemDetail.id).then(res => {
        console.log(res.data.data,'res')
        let CommentLikedList = {}
        let commentList = res.data.data.map(item => {
          item.createTime = formatDateTimes(item.createTime)
          CommentLikedList[item.id] = item.liked
          CommentLikedList['zanNum'+item.id] = item.thumbsUp
          return item
        });
        that.setData({
          commentList,
          CommentLikedList
        })
      })
    })
  },
// 评论点赞
likeComment(e){
  console.log(e.currentTarget.dataset.liked)
  if(wx.getStorageSync('isAuthorization')){
    let commentId = e.currentTarget.dataset.id; 
    this.zan(commentId,this.data.CommentLikedList[commentId]);
  }else {
    App.globalData.toAuthorization()
  }
},
//点赞处理函数    
zan: function (commentId,liked) {
  var that = this;
  if(liked==true){
    wx.showToast({
      title: "取消点赞",
      icon: 'cancel'
    })
  }else {
    wx.showToast({
      title: "点赞成功",
      icon: 'cancel'
    })
  }
  //和后台交互，后台数据要同步
    that._thumpUp(commentId)
},
_thumpUp(commentId){
  let that = this
  giveLike(commentId).then(res => {
    console.log(res,'res')
    let CommentLikedList = {...that.data.CommentLikedList}
    CommentLikedList[commentId] = res.data.data
    if(CommentLikedList[commentId]){
      CommentLikedList['zanNum'+commentId] = (CommentLikedList['zanNum'+commentId])+1
    }else{
      CommentLikedList['zanNum'+commentId] = CommentLikedList['zanNum'+commentId]>0?(CommentLikedList['zanNum'+commentId])-1:0
    }
    that.setData({
      CommentLikedList
    },() => {
      console.log(that.data.CommentLikedList,'11')
    })
  })
},// ---------------------评论功能----------------------------------
bindReply: function (e) {
  console.log(e)
  this.setData({
    releaseFocus: true
  })
},
isfouce: function() {
  this.setData({
    isFouce: false
  })
},
bindTextAreaBlur: function(e) {
  console.log(e.detail.value)
  this.setData({
    isFouce: true,
    inputVal: e.detail.value
  })
},
sendMeg: function (e) {
  console.log("发送消息！")
  console.log(e)
  console.log("获取消息")
  let that = this;
  const shareId = e.detail.target.dataset.shareid
  const comment = that.data.inputVal
  console.log(shareId)
  console.log(comment)
   if (!comment) {
       wx.showToast({
         title: '糟糕，评论是空的！',
       })
     } else {
     that._addCommentData(that.data.shareId*1, that.data.itemDetail.id,comment)
     }
},
tapMove: function (e) {
  this.setData({
    scrollTop: 0
  })
},
onReachBottom:function() {
  this.setData({
    releaseFocus: false
  })
},
  _addCommentData(shareId, commentId, reply1) {
    if(shareId){
      let that = this
      reply(shareId, commentId, reply1).then(res1 => {
        getReply(that.data.itemDetail.id).then(res => {
          console.log(res.data.data, 'res')
          let CommentLikedList = {}
          let commentList = res.data.data.map(item => {
            item.createTime = formatDateTimes(item.createTime)
            CommentLikedList[item.id] = item.liked
            CommentLikedList['zanNum' + item.id] = item.thumbsUp
            return item
          });
          that.setData({
            commentList,
            CommentLikedList
          })
        })
        that.setData({
          inputVal: ''
        })
      })
    }
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})