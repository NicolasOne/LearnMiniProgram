// pages/shopList/shopList.js
import {
  relevanceCard
} from '../../service/card.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseShop: '',
    shopList: [],
    shareId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.shareId,'options')
    this.setData({
      shopList: JSON.parse(options.list),
      shareId: options.shareId*1
    })
  },
  chooseShop(e){
    console.log(e,'ee')
    this.setData({
      chooseShop: e.currentTarget.dataset.id,
      shareId: this.data.shareId
    })
  },
  ok(){
    relevanceCard(this.data.shareId, this.data.chooseShop).then(res => {
      let tip = ''
      if(res.data.status==1){
        tip = '发布成功'
      }else{
        tip = res.data.msg
      }
      wx.removeStorageSync('chooesTagList')
      wx.removeStorageSync('imgList')
      wx.removeStorageSync('content')
      wx.showModal({
        title: '提示',
        content: tip,
        success(res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '../main/main',
            })
          } else if (res.cancel) {
            wx.redirectTo({
              url: '../main/main',
            })
          }
        }
      })
    })
  },
  toCreate(){
    wx.navigateTo({
      url: '../createShop/createShop?list=' + this.options.detail,
    })
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