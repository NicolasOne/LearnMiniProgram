// pages/cardDetail/cardDetail.js
import {
  getCardDetail,
  getShare
} from '../../service/card.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: ["http://jikedd.com:88/eatstreet/M00/00/00/rBJMrV2wWsyACM2kAACPz9359IM769_big.jpg",
    "http://jikedd.com:88/eatstreet/M00/00/00/rBJMrV2wWsyACM2kAACPz9359IM769_big.jpg",
    "http://jikedd.com:88/eatstreet/M00/00/00/rBJMrV2wWsyACM2kAACPz9359IM769_big.jpg"],
    shareList:[],
    cardDetail: {},
    chooseType: 'share',
    currPage: 1,
    cardId: null,
    totalRecord: null,
    collectList: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    this.setData({
      cardId: options.id
    },() => {
      that.getShareList(that.data.cardId,1)
    })
    getCardDetail(options.id).then(res => {
      console.log(res.data.data)
      if (!res.data.data){
        wx.showModal({
          title: '提示',
          content: '获取卡片详情失败！',
          success(res) {
            if (res.confirm) {
              wx.navigateBack()
            } else if (res.cancel) {
              wx.navigateBack()
            }
          }
        })
      }else{
        let detail = res.data.data
        var time = new Date(detail.ctime);
        var y = time.getFullYear();
        var m = (time.getMonth() + 1).length < 2 ? '0' + (time.getMonth() + 1) : (time.getMonth() + 1);
        var d = time.getDate().length < 2 ? '0' + time.getDate() : time.getDate();
        var h = time.getHours().length < 2 ? '0' + time.getHours() : time.getHours();
        var mm = time.getMinutes().length < 2 ? '0' + time.getMinutes() : time.getMinutes();
        var s = time.getSeconds().length < 2 ? '0' + time.getSeconds() : time.getSeconds();
        detail.ctime = y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + s;
        console.log(res.data.data, 'res.data.data')
        let latitude = res.data.data.center.split(',')[1]
        let longitude = res.data.data.center.split(',')[0]
        this.setData({
          cardDetail: detail,
          latitude,
          longitude
        })
      }
    })
  },
  getShareList(cardId, currPage,isTrue){
    getShare(cardId, currPage).then(res => {
      console.log(res.data.data.data,'list')
      if (res.data.data.data){
        let shareList = []
        if (isTrue) {
          shareList = [...this.data.shareList, ...res.data.data.data]
        } else {
          shareList = res.data.data.data
        }
        this.setData({
          totalRecord: res.data.data.totalRecord,
          shareList
        }, () => {
          let newCollectList = this.data.collectList
          this.data.shareList.map(item => {
            newCollectList[item.id] = item.collect
          })
          this.setData({
            collectList: newCollectList
          })
        })
      }else{
        wx.showModal({
          title: '提示',
          content: '获取相关分享失败！',
          success(res) {
            if (res.confirm) {
              wx.navigateBack()
            } else if (res.cancel) {
              wx.navigateBack()
            }
          }
        })
      }
    })
  },
  chooseType(e){
    this.setData({
      chooseType: e.currentTarget.dataset.id
    })
  },
  showMap(){
    let that = this
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        console.log(res,'resrs')
        console.log(that.data,'data')
        var latitude = that.data.latitude*1
        var longitude = that.data.longitude*1
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          name: that.data.cardDetail.eatStreetName,
          scale: 28
        })
      }
    })
    // wx.openLocation({
    //   latitude: that.data.longitude*1,
    //   longitude: that.data.latitude*1,
    //   name: "店铺",
    //   scale: 28
    // })
  },
  clickCollect(e) {
    console.log(e.currentTarget.dataset.id)
    wx.request({
      url: "https://www.jikedd.com/eatStreets/card/collectCard?cardId=" + e.currentTarget.dataset.id,
      data: {},
      method: 'POST',
      header: {
        token: wx.getStorageSync('token')
      },
      success: () => {
        this.setData({
          collectList: {
            ...this.data.collectList,
            [e.currentTarget.dataset.id]: !this.data.collectList[e.currentTarget.dataset.id]
          }
        }, () => console.log(this.data.collectList))
      }
    })
    // console.log(e.currentTarget.dataset.id)
    // collectCard(e.currentTarget.dataset.id).then(res => {

    // })
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
    this.getShareList(this.data.cardId, 1)
    getCardDetail(this.options.id).then(res => {
      console.log(res.data.data)
      this.setData({
        cardDetail: res.data.data
      })
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this
    console.log(that.data.shareList,'that.data.totalRecord')
    if(that.data.shareList.length>=that.data.totalRecord){
      wx.showToast({
        title: '已经到底啦~',
        icon: 'none'
      })
    }else{
      that.setData({
        currPage: that.data.currPage+1
      },() => {
        that.getShareList(that.data.cardId, that.data.currPage,true)
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})