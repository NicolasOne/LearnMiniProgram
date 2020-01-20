// pages/index/index.js
let app = getApp()
import { queryCoverImg } from '../../service/user.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverImg: null,
    time: 5
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.login(this.handlerAfterAuthorize);
  },
  handlerAfterAuthorize() {
    let that = this
    queryCoverImg().then(res => {
      clearInterval(that.clock)
      that.clock = setInterval(() => {
        let time = that.data.time - 1
        that.setData({
          time
        })
      }, 1000)
      that.setData({
        coverImg: res.data.data
      })
      clearTimeout(that.timer)
      that.timer = setTimeout(() => {
        // 登录成功后跳转首页
        wx.redirectTo({
          url: '../main/main'
        })
      }, 5000)
    })
  },
  toHomePage(){
    wx.redirectTo({
      url: '../main/main'
    })
    clearTimeout(this.timer)
    clearInterval(this.clock)
  }
})
 