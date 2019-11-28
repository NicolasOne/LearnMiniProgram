import { TabbarList } from '../../utils/enum.js';
var socketOpen = false
var socketMsgQueue = []
function sendSocketMessage(msg) {
    console.log('send msg:')
    console.log(msg);
    if (socketOpen) {
        wx.sendSocketMessage({
            data: msg
        })
    } else {
        socketMsgQueue.push(msg)
    }
}
let heartCheck = {
  timeout: 10000,
  timeoutObj: null,
  serverTimeoutObj: null,
  reset: function () {
    clearTimeout(this.timeoutObj);
    clearTimeout(this.serverTimeoutObj);
    return this;
  },
  start: function () {
    this.timeoutObj = setTimeout(() => {
      console.log("发送ping");
      wx.sendSocketMessage({
        data: "ping",
        // success(){
        //  console.log("发送ping成功");
        // }
      });
      this.serverTimeoutObj = setTimeout(() => {
        wx.closeSocket();
      }, this.timeout);
    }, this.timeout);
  }
};
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabbarID: TabbarList.home,
        tabbarList: TabbarList,
        handleHomePage: false,
        limit:1
    },
    onPageScroll: function (ev) {    
        if(ev.scrollTop>300){
            this.setData({
              handleHomePage: true
            })
        }else {
            this.setData({
              handleHomePage: false
            })
        }
      },
    // 点击tabbar
    onClickTabbar: function (e) {
        console.log(e)
        this.setData({
            tabbarID: e.detail.id
        })
        wx.setNavigationBarTitle({
            title: this.data.tabbarList[this.data.tabbarID],
        })
    },

    // 设置tabbar选中项
    setTabbar: function (e) {
        this.setData({
            tabbarID: e.detail.id
        })
        wx.setNavigationBarTitle({
            title: this.data.tabbarList[this.data.tabbarID],
        })
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: '#ff5777',
        })
        let curtabbar = this.selectComponent('#tab-bar');
        curtabbar.setTabbarSel(e.detail.id);
    },
  reconnect() {
    if (this.lockReconnect) return;
    this.lockReconnect = true;
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.linkSocket();
      this.lockReconnect = false;
    }, 5000)
  },
  linkSocket(){
    let that = this
    wx.connectSocket({
      url: "wss://www.jikedd.com/eatStreets/socket?token=" + wx.getStorageSync('token'),
      success() {
        console.log('连接成功')
        wx.onSocketOpen(function (res) {
          console.log('WebSocket连接已打开！')
          heartCheck.reset().start()
          socketOpen = true
          for (var i = 0; i < socketMsgQueue.length; i++) {
            sendSocketMessage(socketMsgQueue[i])
          }
          socketMsgQueue = []

          ws.onopen && ws.onopen()
        })

        wx.onSocketMessage(function (res) {
          //收到消息
          if (res.data == "pong") {
            heartCheck.reset().start()
          } else {
          }
          console.log('收到onmessage事件:', res)
          ws.onmessage && ws.onmessage(res)
        })
        wx.onSocketError((res) => {
          console.log('WebSocket连接打开失败')
          that.reconnect()
        })
        wx.onSocketClose((res) => {
          console.log('WebSocket 已关闭！')
          that.reconnect()
        })
        var ws = {
          send: sendSocketMessage,
          onopen: null,
          onmessage: null
        }
        var Stomp = require('../../utils/stomp.js').Stomp;
        Stomp.setInterval = function (interval, f) {
          return setInterval(f, interval);
        };
        Stomp.clearInterval = function (id) {
          return clearInterval(id);
        };
        var client = Stomp.over(ws);

        var destination = '/user/topic/websocket';
        client.connect('user', 'pass', function (sessionId) {
          console.log('sessionId', sessionId)
          client.subscribe(destination, function (body, headers) {
            console.log('From MQ:', body);
            // 存储推送过来的消息
            wx.setStorageSync('news', JSON.stringify(body.body))
          });
          client.send(destination, { priority: 9 }, 'hello workyun.com !');
        })
      }
    })
  },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      
        wx.getLocation({
            type: 'wgs84',
            success(res) {
                console.log(res)
              const latitude = res.latitude
              const longitude = res.longitude
            }
          })
    },
    

    
    /**
     * 生命周期函数--监听页面显示
     */
      onShow: function () {
        this.isClose = false
        this.linkSocket() 
        let { tabbarID, tabbarList } = this.data
        // if (tabbarID == tabbarList.home) {
        //     let homePage = this.selectComponent('#home-page');
        //     homePage.onshow();
        //     homePage.updateBg();
        // } else if (tabbarID == tabbarList.category) {
        //     let categoryPage = this.selectComponent('#category-page');
        //     categoryPage.onshow();
        //     categoryPage.updateBg();
        // } else if (tabbarID == tabbarList.square) {
        //     let squarePage = this.selectComponent('#square-page');
        //     squarePage.onshow();
        //     squarePage.updateBg();
        // } else if (tabbarID == tabbarList.profile) {
        //     let profilePage = this.selectComponent('#profile-page');
        //     profilePage.onshow();
        //     profilePage.updateBg();
            
        // }
        wx.setNavigationBarTitle({
            title: this.data.tabbarList[this.data.tabbarID],
        })
    },

    /**
 
   * 生命周期函数--监听页面隐藏
 
   */
 
  onHide:function() {
  },
 
  /**
 
   * 生命周期函数--监听页面卸载
 
   */
 
  onUnload:function() {
  },
    /**
   * 页面上拉触底事件的处理函数
   */
    onReachBottom: function () {
        let { tabbarID, tabbarList } = this.data
        if (tabbarID == tabbarList.home) {
            let homePage = this.selectComponent('#home-page');
            homePage.onReachBottom();
        }
        if (tabbarID == tabbarList.category) {
          let categoryPage = this.selectComponent('#category-page');
          categoryPage.onReachBottom();
        }
    },

  // 页面下拉刷新
    onPullDownRefresh: function () {
      if (this.data.tabbarID === this.data.tabbarList.home) {
        let homePage = this.selectComponent('#home-page');
        homePage.onPullDownRefresh();
      }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (e) {
        console.log(e,'eee')
        if(e.target.dataset.type=='share'){
            return {
                title: '美食联盟',
                path: '/pages/detail/detail?shareId='+e.target.dataset.item.shareId,
                imageUrl: e.target.dataset.item.shareImg[0]?e.target.dataset.item.shareImg[0]:'../../assets/other/logo.jpg'
            }
        }
    }
})