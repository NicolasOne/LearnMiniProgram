// pages/home/home.js
let app = getApp()
import {
  getBannerData,
  getShareListData
} from '../../service/home.js'
import { formatDateTimes } from '../../utils/utils'
const types = ['0', '1']
import QQMapWX from '../../utils/qqmap-wx-jssdk.js'
let qqmapsdk = new QQMapWX({
  key: 'G4BBZ-NDHKO-GAQWR-SS5O5-VIZ7Q-PPFO7'
})
Component({
  /**
   * 页面的初始数据
   */
  properties: {
    handleHomePage: {
      type: Boolean,
      value: '',
      observer: (newVal, oldVal, changedPath) => {
        console.log('wwwww')
        if(newVal!==oldVal){
          console.log(newVal)
        }
     }
    }
  },
  data: {
    banner: [],
    shareList: [],
    titles: ['最热Hot','最新New'],
    share: {
       '0' : { currPage: 1, list: [] },
       '1' : { currPage: 1, list: [] }
    },
    currentType: 0,
    isBottom:true
  },  
  methods: {
    //-------------------------------网络请求-------------------------------------
    _getBannerData() {
      // 缓存
      if(wx.getStorageSync('home_banner')){
        this.setData({
          banner: JSON.parse(wx.getStorageSync('home_banner'))
        })
      }else{
        getBannerData().then(res => {
          const banner = res.data.data;
          wx.setStorageSync('home_banner',JSON.stringify(banner))
          this.setData({
            banner
          })
        })
      }
    },
    _getShareListData(type,flag){
      console.log(this.data.totalRecord,'this.data.totalRecord')
      if (flag) {
        if (this.data.totalRecord > this.data.share[type].list.length) {
          let currPage = this.data.share[type].currPage + 1
          getShareListData(type, currPage).then(res => {

            // 将数据设置到templist中,更改时间显示状态
            let list = res.data.data.data.map(item => {
              item.shareTime = formatDateTimes(item.shareTime.replace(/-/g, '/'))
              return item
            });
            list = [...this.data.share[type].list, ...res.data.data.data]
            // 将数据设置到data中
            const typeKey = `share.${type}.list`;
            const pagekey = `share.${type}.currPage`;
            if(type==1){
              let shareList2 = {
                [typeKey]: list,
                [pagekey]: currPage,
                isBottom: true
              }
              wx.setStorageSync('home_share_list2',JSON.stringify(shareList2))
            }else {
              let shareList1 = {
                [typeKey]: list,
                [pagekey]: currPage,
                isBottom: true
              }
              wx.setStorageSync('home_share_list1',JSON.stringify(shareList1))
            }
            this.setData({
              [typeKey]: list,
              [pagekey]: currPage,
              isBottom: true
            })
          })
        } else {
          wx.showToast({
            title: '已经到底啦~',
            icon: 'none'
          })
        }
      }else{
        getShareListData(type, 1).then(res => {

          // 将数据设置到templist中,更改时间显示状态
          let list = res.data.data.data.map(item => {
            item.shareTime = formatDateTimes(item.shareTime.replace(/-/g, '/'))
            return item
          });
          list = res.data.data.data
          // 将数据设置到data中
          const typeKey = `share.${type}.list`;
          const pagekey = `share.${type}.currPage`;
          this.setData({
            [typeKey]: list,
            [pagekey]: currPage,
            isBottom: true
          })
        })
      }
      
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
      this._getShareListData(0,true)
      this._getShareListData(1,true)
    },
    // 获取位置
    getLoaction(){
      let that = this
      // 获取坐标
      wx.getLocation({
        type: 'wgs84',
        success (res) {
          const latitude = res.latitude
          const longitude = res.longitude
          wx.setStorageSync('longitude',res.longitude)
          wx.setStorageSync('latitude',res.latitude)
          qqmapsdk.reverseGeocoder({
            location: {
              latitude,
              longitude
            },
            success:(res) => {
              wx.setStorageSync('adcode',res.result.ad_info.adcode)
              console.log(res.result.ad_info.adcode,'res.result.ad_info.adcoderes.result.ad_info.adcoderes.result.ad_info.adcode')
              // 获取的城市
              wx.setStorageSync('nowCity',res.result.address_component.city)
              wx.setStorageSync('location',JSON.stringify(res.result.ad_info.location))
            }
          })
        }
       })
    },
  },
  ready(){
    console.log(this.properties)
    // 获取轮播图
    this._getBannerData()
    // 获取分类详情
    // 缓存数据
    if(wx.getStorageSync('home_share_list1')){
      let shareList1 = JSON.parse(wx.getStorageSync('home_share_list1'))
      this.setData({
        ...this.data,
        ...shareList1
      },() => {
        if(wx.getStorageSync('homePageScroll')){
          wx.pageScrollTo({
            scrollTop:wx.getStorageSync('homePageScroll'),
              success:function(){
              }
          })
        }
      })
    }else{
      getShareListData(0, this.data.share[0].currPage).then(res => {

        // 将数据设置到templist中,更改时间显示状态
        let list = res.data.data.data.map(item => {
          item.shareTime = formatDateTimes(item.shareTime.replace(/-/g, '/'))
          return item
        })
        // 将数据设置到data中
        const typeKey = `share.0.list`;
        let shareList1 = {
          [typeKey]: list,
          isBottom: true,
          totalRecord: res.data.data.totalRecord
        }
        wx.setStorageSync('home_share_list1',JSON.stringify(shareList1))
        this.setData({
          [typeKey]: list,
          isBottom: true,
          totalRecord: res.data.data.totalRecord
        })
      })
    }
    if(wx.getStorageSync('home_share_list2')){
      let shareList2 = JSON.parse(wx.getStorageSync('home_share_list2'))
      this.setData({
        ...this.data,
        ...shareList2
      },() => {
        if(wx.getStorageSync('homePageScroll')){
          wx.pageScrollTo({
            scrollTop:wx.getStorageSync('homePageScroll'),
              success:function(){
              }
          })
        }
      })
    }else{
      getShareListData(1, this.data.share[0].currPage).then(res => {

        // 将数据设置到templist中,更改时间显示状态
        let list = res.data.data.data.map(item => {
          item.shareTime = formatDateTimes(item.shareTime.replace(/-/g, '/'))
          return item
        })
        // 将数据设置到data中
        const typeKey = `share.1.list`;
        let shareList2 = {
          [typeKey]: list,
          isBottom: true,
          totalRecord: res.data.data.totalRecord
        }
        wx.setStorageSync('home_share_list2',JSON.stringify(shareList2))
        this.setData({
          [typeKey]: list,
          isBottom: true,
          totalRecord: res.data.data.totalRecord
        })
      })
    }
    
    let that = this
    if(!wx.getStorageSync('adcode')){
      wx.getSetting({
        success: (res) => {
          console.log(JSON.stringify(res))
          // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
          // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
          // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
          if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
            wx.showModal({
              title: '请求授权当前位置',
              content: '需要获取您的地理位置，请确认授权',
              success: function (res) {
                if (res.cancel) {
                  wx.showToast({
                    title: '拒绝授权',
                    icon: 'none',
                    duration: 1000
                  })
                } else if (res.confirm) {
                  wx.openSetting({
                    success: function (dataAu) {
                      console.log(dataAu,'dataAu')
                      if (dataAu.authSetting["scope.userLocation"] == true) {
                        wx.showToast({
                          title: '授权成功',
                          icon: 'success',
                          duration: 1000
                        })
                        //再次授权，调用wx.getLocation的API
                        that.getLoaction()
                      } else {
                        wx.showToast({
                          title: '授权失败',
                          icon: 'none',
                          duration: 1000
                        })
                      }
                    }
                  })
                }
              }
            })
          } else if (res.authSetting['scope.userLocation'] == undefined) {
            //调用wx.getLocation的API
            that.getLoaction()
          }
          else {
            //调用wx.getLocation的API
            that.getLoaction()
          }
        }
      })
    }
    
  }
})