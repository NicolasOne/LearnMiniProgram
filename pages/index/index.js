// pages/index/index.js
let app = getApp()
import { queryCoverImg } from '../../service/user.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverImg: null
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
  }
})
 