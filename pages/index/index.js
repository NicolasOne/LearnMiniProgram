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
    wx.setStorageSync('home_banner',false)
    wx.setStorageSync('home_share_list1',false)
    wx.setStorageSync('home_share_list2',false)
    wx.setStorageSync('adcode',false)
    wx.setStorageSync('category_card_list',false)
    wx.setStorageSync('category_map_data',false)
    wx.setStorageSync('profile_user_info',false)
    wx.setStorageSync('profile_user_flag', false)
    wx.setStorageSync('cardPageScroll', false)
    wx.setStorageSync('homePageScroll1', false)
    wx.setStorageSync('homePageScroll2', false)
    wx.setStorageSync('homePageFlag',false)
    let that = this
    queryCoverImg().then(res => {
      clearInterval(that.clock)
      that.clock = setInterval(() => {
        let time = that.data.time>0?that.data.time - 1:0
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
 