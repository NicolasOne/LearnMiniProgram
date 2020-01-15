// pages/myNotification/myNotification.js
const utils = require('../../utils/utils.js');
const formatTime = utils.formatDateTimes;
import { readMsg, markRead } from '../../service/user'
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
    if(wx.getStorageSync('news')){
      let msgs = JSON.parse(wx.getStorageSync('news'))
      console.log(msgs,'msgs')
      let msg = []
      msgs = msgs.sort((a,b) => {
        return b.pushDate - a.pushDate
      })
      msgs.forEach(item => {
        item.pushDate = formatTime(item.pushDate.replace(/-/g, '/'))
        if(item.cardDetail){
          item.cardDetail.ctime = formatTime((item.cardDetail.ctime).replace(/-/g, '/'))
        }
        msg.push(item)
      })
      this.setData({
        msgs:msg
      })
    }
  },
  clearAll(){
    wx.showModal({
      title: '提示',
      content: '确定要清空全部消息吗？',
      success: (res) => {
        if (res.confirm) {
          console.log('用户点击确定')
          markRead().then(res => {
            if(res.data.status==1){
              this.setData({
                msgs: []
              })
              wx.setStorageSync('news',JSON.stringify([]))
              wx.showToast({
                title: '清除成功',
                icon: 'none',
                duration: 2000
              })
            }else{
              wx.showToast({
                title: '清除失败',
                icon: 'none',
                duration: 2000
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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
          url: '../cardDetail/cardDetail?id='+carddetail.id,
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