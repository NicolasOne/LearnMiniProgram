// pages/cardByArea/cardByArea.js
import {
  getMyCardDetailByArea,
  collectCard,
  unCollectCard
} from '../../service/card.js'
const utils = require('../../utils/utils.js');
const formatTime = utils.formatDateTimes;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cards: [],
    collectList: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.setData({
      user: wx.getStorageSync('user')
    })
    getMyCardDetailByArea(this.options.code).then(res => {
      console.log(res,'rsresrseres')
      let cards = res.data.data;
      cards && cards.map((share) => {
        const item = share;
        item.ctime = formatTime(item.ctime.replace(/-/g, '/'));
        return item;
      });
      this.setData({
        cards
      },() => {
        let newCollectList = this.data.collectList
        this.data.cards.map(item => {
          newCollectList[item.id] = item.collect
        })
        this.setData({
          collectList: newCollectList
        })
      })
    })
  },
  toCardDetail(e) {
    console.log(e,'eeeeee')
    wx.navigateTo({
      url: '../cardDetail/cardDetail?id='+e.currentTarget.dataset.id,
    })
  },
  clickCollect(e) {
    console.log(e.currentTarget.dataset.id)
    if (this.data.collectList[e.currentTarget.dataset.id]) {
      unCollectCard(e.currentTarget.dataset.id).then(res => {
        let cards = this.data.cards.map((item,index) => {
          if(item.id==e.currentTarget.dataset.id){
            item.collectCount = item.collectCount==0?0:item.collectCount-1
          }
          return item
        })
        this.setData({
          collectList: {
            ...this.data.collectList,
            [e.currentTarget.dataset.id]: !this.data.collectList[e.currentTarget.dataset.id]
          },
          cards
        }, () => console.log(this.data.collectList))
      })
    } else {
      collectCard(e.currentTarget.dataset.id).then(res => {
        let cards = this.data.cards.map((item,index) => {
          if(item.id==e.currentTarget.dataset.id){
            item.collectCount = item.collectCount+1
          }
          return item
        })
        this.setData({
          collectList: {
            ...this.data.collectList,
            [e.currentTarget.dataset.id]: !this.data.collectList[e.currentTarget.dataset.id]
          },
          cards
        }, () => console.log(this.data.collectList))
      })
    }
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