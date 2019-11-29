// pages/myNotification/myNotification.js
const utils = require('../../utils/utils.js');
const formatTime = utils.formatDateTimes;
import { readMsg } from '../../service/user'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgs:[],
    active: {
      1: "发表了评论：",
      2: "点赞了：", 
      3: "关联了卡片：",
      4: "回复了：",
      5: "点赞了：", 
      6: "收藏了：" 
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    let msgs = JSON.parse(wx.getStorageSync('news'))
    let msg = []
    msgs = msgs.sort((a,b) => {
      return b.pushDate - a.pushDate
    })
    msgs.forEach(item => {
      item.pushDate = formatTime(new Date(item.pushDate))
      if(item.cardDetail){
        item.cardDetail.ctime = formatTime(new Date(item.cardDetail.ctime))
      }
      msg.push(item)
    })
    this.setData({
      msgs:msg
    })
  },
  toDetail(e){
    console.log(e,'e')
    let { type, shareid, carddetail, msgid, commentdetail } = e.currentTarget.dataset
    readMsg(msgid).then(res => {
      let news = JSON.parse(wx.getStorageSync('news'))
      let newsIndex = null
      news.map((item,index) => {
        if(item.msgId==msgid){
          newsIndex = index
        }
      })
      news.splice(newsIndex,1)
      wx.setStorageSync('news',JSON.stringify(news))
      if(type==1||type==2||type==3){
        wx.navigateTo({
          url: '../detail/detail?shareId='+shareid,
        })
      }else if(type==4||type==5){
        wx.navigateTo({
          url: '../commentDetail/commentDetail?itemDetail='+JSON.stringify(commentdetail),
        })
      }else{
        wx.navigateTo({
          url: '../cardDetail/cardDetail?id='+JSON.stringify(carddetail).id,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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