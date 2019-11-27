// pages/myNotification/myNotification.js
const utils = require('../../utils/utils.js');
const formatTime = utils.formatDateTimes;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg:[
      {
        type: 1,
        userName: 'x姓名',
        userImg: '../../assets/other/pic.jpg',
        createTime: 1574005473731,
        shareId: 11,
        shareImg: '../../assets/other/logo.jpg',
        shareContent: '内核杜松后哈佛i是四号覅和我i发哈是否能卢卡斯第三方hi撒回复哦撒网iu红日哦你发送发货是否能花送花',
        comment: '平路ing谁规定古方不好看撒法货是佛i武汉覅哦'
      },
      {
        type: 2,
        userName: 'x姓名',
        userImg: '../../assets/other/pic.jpg',
        createTime: 1574005473731,
        shareId: 11,
        shareImg: '../../assets/other/logo.jpg',
        shareContent: '内核杜松后哈佛i是四号覅和我i发哈是否能卢卡斯第三方hi撒回复哦撒网iu红日哦你发送发货是否能花送花'
      },
      {
        type: 3,
        userName: 'x姓名',
        userImg: '../../assets/other/pic.jpg',
        createTime: 1574005473731,
        shareId: 11,
        shareImg: '../../assets/other/logo.jpg',
        shareContent: '内核杜松后哈佛i是四号覅和我i发哈是否能卢卡斯第三方hi撒回复哦撒网iu红日哦你发送发货是否能花送花',
        shopName: '商家名称'
      },
      {
        type: 4,
        userName: 'x姓名',
        userImg: '../../assets/other/pic.jpg',
        createTime: 1574005473731,
        detail: {},
        comment: '平路ing谁规定古方不好看撒法货是佛i武汉覅哦',
        userComment: '五日黑i天地分开说服力和视频'
      },
      {
        type: 5,
        userName: 'x姓名',
        userImg: '../../assets/other/pic.jpg',
        createTime: 1574005473731,
        detail: {},
        comment: '平路ing谁规定古方不好看撒法货是佛i武汉覅哦',
        userComment: '五日黑i天地分开说服力和视频'
      },
      {
        type: 6,
        userName: 'x姓名',
        userImg: '../../assets/other/pic.jpg',
        createTime: 1574005473731,
        cardId: 11,
        detail: {shopName: '商家名称',shopImg: '../../assets/other/logo.jpg',createTime: 1574005473731,shopContent: 'shjdsohshdioshdiosdsd'}
      }
    ],
    active: {
      1: "发表了评论：",
      2: "点赞了：", 
      3: "关联了卡片：",
      4: "回复了：",
      5: "点赞了：", 
      6: "收藏了：" 
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let newMsg = this.data.msg
    let msg = []
    newMsg.forEach(item => {
      item.createTime = formatTime(new Date(item.createTime))
      msg.push(item)
    })
    this.setData({
      msg
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