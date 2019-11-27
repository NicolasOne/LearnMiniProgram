import { baseURL } from '../../service/config'
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    getPhoneNumber: false,
    encryptedData: '',
    iv: ''
    // encryptedDataPhone: null,
    // ivPhone: null
  },
  bindGetUserInfo(e) {
    let that = this
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      this.setData({
        // getPhoneNumber: true,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      },() => {
        let data = {
          encryptedData: that.data.encryptedData,
          iv: that.data.iv
        }
        wx.request({
          url: baseURL+'/wx/user/getUserInfo',
          data,
          header: {'content-type':'application/json','token':wx.getStorageSync('token')},
          method: 'GET',
          dataType: 'json',
          responseType: 'text',
          success: (res)=>{
            console.log(res.data.data,'resres')
            wx.setStorageSync('city', res.data.data.city)
            wx.setStorageSync('province', res.data.data.province)
            wx.setStorageSync('country', res.data.data.country)
            wx.setStorageSync('nickName', res.data.data.nickName)
            wx.setStorageSync('avatarUrl', res.data.data.avatarUrl)
            wx.setStorageSync('isAuthorization', true)
            wx.redirectTo({
              url: '../index/index'
            })
          },
        })
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '提示',
        content: '获取头像昵称失败',
        showCancel: false,
        confirmText: '返回首页',
        success: function (res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '../index/index'
            })
          }
        }
      })
    }
  },
  bindGetPhoneNumber: (e) => {
    console.log(e)
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      this.setData({
        encryptedDataPhone: e.detail.encryptedData,
        ivPhone: e.detail.iv
      },() => saveUserInfo(...this.data))
      wx.redirectTo({
        url: '../index/index'
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '提示',
        content: '获取手机号失败',
        showCancel: false,
        confirmText: '返回首页',
        success: function (res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '../index/index'
            })
          }
        }
      })
    }
  }
})
