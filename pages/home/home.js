// pages/home/home.js
import {
  getBannerData,
  getShareListData
} from '../../service/home.js'
const utils = require('../../utils/utils.js');
const formatTime = utils.formatDateTimes;
const types = ['0', '1']
Page({
  /**
   * 页面的初始数据
   */
  data: {
    banner: [],
    shareList: [],
    titles: ['最热Hot','最新New'],
    share: {
       '0' : { currPage: 0, list: [] },
       '1' : { currPage: 0, list: [] }
    },
    currentType: 0,
    isBottom:true,
    pageTottomText:'——— ☺没啦———'
  },  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取轮播图
    this._getBannerData()
    // 获取分类详情
    this._getShareListData(0)
    this._getShareListData(1)
  },
  //-------------------------------网络请求-------------------------------------
  _getBannerData() {
    getBannerData().then(res => {
      const banner = res.data.data;
      this.setData({
        banner
      })
    })
  },
  _getShareListData(type){
    //获取页数
    const currPage = this.data.share[type].currPage + 1;
    getShareListData(type, currPage).then(res => {

      // 将数据设置到templist中
      let list = res.data.data.data;
      if(res.data.data.totalRecord > 0){
        const tempShareList = this.data.share[type].list;
        if(list.length==0) {
          wx.showToast({
            title: '到底了老哥',
          })
          this.setData({
            isBottom:true
          })
        }
        // console.log(list.length)
        // list.forEach(function(item,index){
        //   item.shareTime = formatTime(new Date(item.shareTime));
        // })
        // console.log(list)
        tempShareList.push(...list)
        // 将数据设置到data中
        const typeKey = `share.${type}.list`;
        const pagekey = `share.${type}.currPage`;
        this.setData({
          [typeKey]: tempShareList,
          [pagekey]: currPage
        })
      }      
    })
  },
  // 设置显示的tab
  setActive: function (e) {

    // 获取当前点击的index
    var index = e.target.dataset.index;
    // 初始化动画数据
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out',
      delay: 0
    })
    // 距离左边位置
    animation.left((index * 250) + 'rpx').step()
    // 设置动画
    this.setData({
      animationData: animation.export()
    })
    // 设置对应class
    this.setData({
      isActive: index
    })
  },
  // ------------------------------事件监听--------------------------------------
  handleTabClick(event) {
    const index = event.detail.index;
    // 设置currentType
    this.setData({
      currentType: types[index]
    })
  },
  // 判断用户是否已经授权，没有的话跳转到登陆授权页
  checkUserInfo() {
    wx.getUserInfo({
      success: function (res) {
        wx.switchTab({
          url: '/pages/profile/profile',
        })
      }
    })
  },
  // -----------------------------下拉刷新事件---------------------------------------
  onShareAppMessage() {
    return {
      title: '下拉刷新',
      path: 'page/home/home'
    }
  },

  onPullDownRefresh() {
    wx.showToast({
      title: 'loading...',
      icon: 'loading'
    })
    console.log('onPullDownRefresh', new Date())
  },

  stopPullDownRefresh() {
    wx.stopPullDownRefresh({
      complete(res) {
        wx.hideToast()
        console.log(res, new Date())
      }
    })
  },
  // 上拉加载
  onReachBottom: function (type) {
    this._getShareListData(0)
    this._getShareListData(1)
  },
  // ----------------------添加分享跳转--------------
  bindShareComent(e) {
    wx.navigateTo({
      url: '../share/share',
    })
  }
})