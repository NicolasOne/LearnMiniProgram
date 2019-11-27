// pages/index/index.js
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.login(this.handlerAfterAuthorize);
  },
  handlerAfterAuthorize() {
    // 登录成功后跳转首页
    wx.redirectTo({
      url: '../main/main'
    })
  }
})
 