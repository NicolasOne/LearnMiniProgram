// pages/myShare/myShare.js
import {
  getMyShare
} from '../../service/user.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    share: [],
    currPage: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    getMyShare(this.data.currPage).then(res => {
      that.setData({
        share: res.data.data.data,
        totalRecord: res.data.data.totalRecord
      },() => console.log(that.data.share))
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this
    getMyShare(1).then(res => {
      that.setData({
        share: res.data
      })
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this
    if (that.data.totalRecord <= that.data.share.length){
      wx.showToast({
        title: '已经到底啦~',
        icon: 'none'
      })
    }else{
      getMyShare(this.data.currPage).then(res => {
        let share = [...that.data.share,...res.data.data.data]
          that.setData({
            share
          })
      })
    }
    getMyShare(this.data.currPage).then(res => {
      console.log(res,'shareList')
      if(res.totalRecord<that.share){
        
      }else {
        let share = [...that.data.share,...res.data]
        that.setData({
          share
        })
      }
    })
  }
})