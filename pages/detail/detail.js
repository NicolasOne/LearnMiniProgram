// pages/detail/detail.js

import {
  getDetailData,
  saveCommentData,
  giveLike
} from '../../service/detail.js'
import { formatDateTimes } from '../../utils/utils'
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputVal: '',
    commentList:[],
    tagList:[],
    imgList:[],
    city:'',
    userName: '',
    thumbsUp: '',
    shareContent: '',
    headPortrait: '',
    shareId:0,
    createTime:'',
    releaseFocus: true,
    isFouce: true,
    CommentLikedList:{}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var shareId = options.shareId;
    this._getDetailData(shareId)
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
  },
  _getDetailData(shareId) {
    getDetailData(shareId).then(res => {
      console.log(res)
      let CommentLikedList = {}
      let commentList = res.data.data.commentList.map(item => {
        item.createTime = formatDateTimes(item.createTime.replace(/-/g, '/'))
        CommentLikedList[item.id] = item.liked
        CommentLikedList['zanNum'+item.id] = item.thumbsUp
        return item
      });
      const city = res.data.data.city;
      const imgList = res.data.data.imgList;
      const shareContent = res.data.data.shareContent;
      const tagList = res.data.data.tagList;
      const userName = res.data.data.userName;
      const headPortrait = res.data.data.headPortrait;
      const thumbsUp = res.data.data.thumbsUp;
      const shareId = res.data.data.id;
      const createTime = res.data.data.createTime;
      this.setData({
        commentList,
        city,
        imgList,
        shareContent,
        tagList,
        userName,
        thumbsUp,
        shareId,
        createTime,
        headPortrait,
        CommentLikedList
      })
    })
  },
  // ---------------------图片放大----------------------------------
   topic_preview(e) {
      var that = this;
      var id = e.currentTarget.dataset.id;
      console.log(e)
      var url = e.currentTarget.dataset.url;
      var item = e.currentTarget.dataset.item;
      var previewImgArr = [];
      //通过循环在数据链里面找到和这个id相同的这一组数据，然后再取出这一组数据当中的图片
      wx.previewImage({
        current: url, // 当前显示图片的http链接
        urls: item // 需要预览的图片http链接列表
      })
  },
  // ---------------------评论功能----------------------------------
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
    if(wx.getStorageSync('isAuthorization')){
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
          that._addCommentData(shareId,comment)
          that._getDetailData(shareId)
          that.setData({
            inputVal:''
          })
        }
    }else {
      App.globalData.toAuthorization()
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
  _addCommentData(shareId, comment) {
    saveCommentData(shareId, comment).then(res => {
      console.log(res)
    })
  },
  // 打开评论详情
  toCommentDetail(e){
    wx.navigateTo({
      url: '../commentDetail/commentDetail?itemDetail='+JSON.stringify(e.currentTarget.dataset.item)+'&shareId='+this.options.shareId,
    })
  },
  // 转发给朋友
  toShareNews(){}
})