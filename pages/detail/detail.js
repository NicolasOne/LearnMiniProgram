// pages/detail/detail.js

import {
  getDetailData,
  saveCommentData
} from '../../service/detail.js'

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
    shareId:0,
    createTime:'',
    releaseFocus: true,
    isFouce: true 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var shareId = options.shareId;
    this._getDetailData(shareId)
  },
  _getDetailData(shareId) {
    getDetailData(shareId).then(res => {
      console.log(res)
      const commentList = res.data.data.commentList;
      const city = res.data.data.city;
      const imgList = res.data.data.imgList;
      const shareContent = res.data.data.shareContent;
      const tagList = res.data.data.tagList;
      const userName = res.data.data.userName;
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
        createTime
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
  }
})