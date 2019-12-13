//app.js

import {
  baseURL
} from 'service/config.js'
App({
  globalData: {
    token:'',
    userInfo:{},
    addText: '玩命加载中',
    endText: '————————老哥我到底了————————',
    sid: '',
    windowHeight: null,
    windowWidth: null,
    model: null,
    // 授权提醒
    toAuthorization: () => {
      wx.showModal({
        title: '提示',
        content: '需要先授权哦~',
        confirmText: '去授权',
        success (res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '/pages/login/login'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  onLaunch: function() {
    //const self = this;
    wx.getSystemInfo({
      success:(res) => {
        console.log(res)
        this.globalData.windowHeight = res.windowHeight;
        this.globalData.windowWidth = res.windowWidth;
        this.globalData.model = res.model;
      },
    })
  },
  onShow: function(){
    console.log('show')
    // 为了从后台返回小程序 token不失效，导致调取接口失败
    let that = this
    if (wx.getStorageSync('token')){
      // 判断 session_key 是否已经过期
      wx.checkSession({
        success: function () {
          console.log('token未过期')
        },
        fail: function () {
          // 微信登录授权
          wx.login({
            success: res => {
              if (res.code) {
                // console.log(res.code)
                // return
                wx.request({
                  url: baseURL + '/wx/user/login',
                  data: {
                      code: res.code,
                  },
                  success: res => {
                    // 通过 code 换取小程序 open_id
                    // 存储小程序 open_id
                    wx.setStorageSync('token', res.data.data.token);
                  }
                })
              } else {
                console.log('2.个人微信登录失败！app-onShow' + res.data.data.errMsg)
              }
            },
            fail: res => {
              console.log('-- wx.login 失败 app-onShow--', res)
            }
          })
        }
      })
    }else{
      // 微信登录授权
      wx.login({
        success: res => {
            if (res.code) {
                console.log(res.code)
                wx.request({
                    url: baseURL + '/wx/user/login',
                    data: {
                        code: res.code,
                    },
                    success: res => {
                        // 通过 code 换取小程序 open_id
                        // 存储小程序 open_id
                        // wx.setStorageSync('open_id', res.open_id);
                        // 储存 token，后面调接口放到 header 里
                        wx.setStorageSync('token', res.data.data.token||'');
                        wx.setStorageSync('city', res.data.data.userInfo.city||'')
                        wx.setStorageSync('province', res.data.data.userInfo.province||'')
                        wx.setStorageSync('country', res.data.data.userInfo.country||'')
                        wx.setStorageSync('nickName', res.data.data.userInfo.nickName||'')
                        wx.setStorageSync('avatarUrl', res.data.data.userInfo.avatarUrl||'')
                        wx.setStorageSync('isAuthorization', res.data.data.userInfo||'')
                    }
                })
            } else {
                console.log('2.个人微信登录失败！' + res.errMsg)
            }
        },
        fail: res => {
            console.log('-- wx.login 失败 --', res)
        }
    })
    }
  },
  login: function (cb) {
    console.log('调用app.login')
    var that = this;
    // 判断本地存储的 open_id 是否已经被清除
    if (wx.getStorageSync('token')) {
        //判断token是否过期
        wx.request({
          url: baseURL+'/wx/user/tokenIsExpire',
          method: 'get',
          header: {
            token: wx.getStorageSync('token')
          },
          success: (res) => {
            // token未过期
            if(!res.data.data==true) {
              // 判断 session_key 是否已经过期
              wx.checkSession({
                success: function () {
                    console.log('session_key 未过期，并且在本生命周期一直有效');
                    cb && typeof cb == 'function' && cb();
                },
                fail: function () {
                    that.loginAfterSession(cb);
                }
              })
              // token已过期
            } else {
              that.loginAfterSession(cb);
            }
          },
          fail: function(err) {
            console.log(err)
          }
        })
    } else {
        that.loginAfterSession(cb);
    }
  },
  loginAfterSession: function (cb) {
    wx.showLoading({
        title: '正在登录...',
        mask: true
    })
    // 微信登录授权
    wx.login({
        success: res => {
            if (res.code) {
                console.log(res.code)
                wx.request({
                    url: baseURL + '/wx/user/login',
                    data: {
                        code: res.code,
                    },
                    success: res => {
                        console.log(res,'openid')
                        // 通过 code 换取小程序 open_id
                        wx.hideLoading();
                        // 存储小程序 open_id
                        // wx.setStorageSync('open_id', res.open_id);
                        // 储存 token，后面调接口放到 header 里
                        wx.setStorageSync('token', res.data.data.token||'');
                        wx.setStorageSync('city', res.data.data.userInfo.city||'')
                        wx.setStorageSync('province', res.data.data.userInfo.province||'')
                        wx.setStorageSync('country', res.data.data.userInfo.country||'')
                        wx.setStorageSync('nickName', res.data.data.userInfo.nickName||'')
                        wx.setStorageSync('avatarUrl', res.data.data.userInfo.avatarUrl||'')
                        wx.setStorageSync('isAuthorization', res.data.data.userInfo||'')
                        cb && typeof cb == 'function' && cb();
                    }
                })
            } else {
                console.log('2.个人微信登录失败！' + res.errMsg)
            }
        },
        fail: res => {
            console.log('-- wx.login 失败 --', res)
        }
    })
  }
})