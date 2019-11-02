//app.js
const TOKEN = 'token'
import {
  saveUserInfo
} from 'service/user.js'
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
    });
    // 取出token
    const token = wx.getStorageSync(TOKEN)
    // 判断token是否有值
    if(token && token.length !==0) {
      //验证token是否过期
      this.check_token(token)
    } else {
        this.login() //没有token
    }
  },
  login()  {
    // 登录
    console.log('----------------登陆操作--------------------')
    wx.login({    
      success: (res) => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        const code = res.code;
        console.log(res)
        wx.request({
          url: 'https://www.jikedd.com/eatStreets/wx/user/login',
          method: 'get',
          data: {
            code
          },
          success: (res) => {
            console.log(res)
            const token = res.data.data;
            this.globalData.token = token;
            console.log("token--")
            console.log(token)

            // 进行本地存储
            wx.setStorageSync(TOKEN, token);
            this.getUsersInfo();
          }
        })
      }
    })
  },
  check_token(token) {
    // 验证token
    console.log('-----------------------------验证token------------------------'+token)
      wx.request({
        url: 'https://www.jikedd.com/eatStreets/wx/user/tokenIsExpire',
        method: 'get',
        header: {
          token
        },
        success: (res) => {
          if(!res.data.data==true) {
            this.globalData.token = token;
          } else {
            this.login()
          }
        },
        fail: function(err) {
          console.log(err)
        }
      })
  },
  login1 : function (callback) {  //callback是用户授权登录后的一些回调函数
    var that = this;
    //获取登录code
    wx.login({// 小程序登录接口，成功后拿到code 到后台换取 openId, sessionKey, unionId
      success: function (res) {
        if (res.code) {
          var codes = res.code;
          getUserInfoHandle(codes, callback)
          console.log("res")
          console.log(res)
          //获取用户信息  // 因为 我们程序 要收集用户头像，昵称等，有一套用户体系
          wx.getSetting({ //先调用getSetting 拿到用户已经授权的一些列表，如果已经授权 再后面代码 就无需再wx.authorize 授权
            success: res => {
              console.log("-----------")
              console.log(res)
              if (res.authSetting['scope.userInfo']) {      // 用户信息已经授权过，
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                callback ? (that.getUserInfoHandle(codes, callback)) : (that.getUserInfoHandle(codes));     
                //getUserInfoHandle 方法是处理用户信息，提取出来
              } else {
                wx.authorize({ // 如果在那用户授权信息的时候 没有拿到，则调用wx.authorize 授权，拿用户userInfo
                  scope: 'scope.userInfo',
                  success: res => {
                    //用户已经同意小程序授权
                    console.log("授权")
                    console.log(res)
                    callback ? (that.getUserInfoHandle(codes, callback)) : (that.getUserInfoHandle(codes));  //同上
                  },
                  fail: (e) => { 
                    //如果用户点击拒绝授权，则调用wx.openSetting 调起客户端小程序设置界面，返回用户设置的操作结果。在这边做了个封装
                    that.openSetting()
                  }
                })
              }
            }
          });
        } else {
          that.logon1(); //登录失败的话 ，重新调用 登录方法
          return false;
        }
      }
    })
  },
  //getUserInfo
  getUserInfoHandle: function (codes, callback) {         
    // codes是wx.login 后拿到的code,callback是登录成功的回调函数
    var that = this;
    wx.getUserInfo({                                    
      // 获取用户信息
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        that.globalData.userInfo = res.userInfo;       
        // 存在全局 之后供各个page拿数据
        // 所以此处加入 callback 以防止这种情况
        if (that.userInfoReadyCallback) {  
          // userInfoReadyCallback是个回调函数 由于wx.getUserInfo 是异步的，
          //当各个page需要userInfo信息时，先判断全局userInfo是否有信息，
          //没有则定义个回调app.userInfoReadyCallback 自己传个回调函数，才能拿到userInfo数据
          that.userInfoReadyCallback(res)
        }
        const encryptedData = res.encryptedData;
        const iv = res.iv;
        const token = wx.getStorageSync(TOKEN)
        //用户信息入库
        that.check_token(token);
        saveUserInfo(token, encryptedData, iv).then(res => {
           console.log(res)
         })     
        //登录请求
      }
    })
  },
  //openSetting
  openSetting: function () {
    var that = this;
    wx.showModal({                                    // modal 提示用户
      title: '提示',
      content: '小程序需要获取用户信息权限，点击确认。前往设置或退出程序？',
      showCancel: false,
      success: function (res) {
        wx.openSetting({  // 调起客户端小程序设置界面
          success: (res) => {
            var userInfoFlag = res.authSetting['scope.userInfo'];    //拿到用户操作结果
            if (!userInfoFlag) { 
              // 如果用户没有点开同意用户授权 ，则再调用openSetting 弹框提示，总之 同意了 才会关闭modal 进入我们小程序
              that.openSetting();
            } else {
              that.login();
              // 用户成功设置授权后，再调用登录方法 ，给到后台 拿用户信息 等操作
            }
          }
        })
      }
    })
  },
  getUsersInfo: function() {
    wx.getUserInfo({
      success: function (res) {
        console.log("999999999999999999999")
        console.log(res)
        const encryptedData = res.encryptedData;
        const iv = res.iv;
        const token = wx.getStorageSync(TOKEN)
        //用户信息入库
        console.log("获取用户信息：")
        console.log(res)
       // this.check_token(token);
       
        saveUserInfo('fab6bd7a1af92c1d80602e52ec26a5f2', encryptedData, iv).then(res => {
          console.log(res)
        })
      },
      fail: (e) => {
        console.log("smkkkkk")
      }
    })
  },
  getu: function () {
    // 验证token
    wx.getUserInfo({
      success: function (res) {
        console.log("999999999999999999999")
        console.log(res)
        const encryptedData = res.encryptedData;
        const iv = res.iv;
        const token = wx.getStorageSync(TOKEN)
        var userPhone = '15735655181';
        //用户信息入库
        console.log("获取用户信息：")
        console.log(res)
        wx.request({
          url: 'https://www.jikedd.com/eatStreets/wx/user/getUserInfo',
          method: 'get',
          data:{
            encryptedData,
            iv,
            userPhone
          },
          header: {
            token
          },
          success: (res) => {
            console.log(res)
          },
          fail: function (err) {
            console.log(err)
          }
        })
      }
    })
  },
})