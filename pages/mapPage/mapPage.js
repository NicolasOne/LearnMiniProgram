// pages/mapPage/mapPage.js
import QQMapWX from '../../utils/qqmap-wx-jssdk'
let qqmapsdk
Page({
  data: {
    latitude: 0,//地图初次加载时的纬度坐标
    longitude: 0, //地图初次加载时的经度坐标
    map: false
  },
  onLoad: function () {
    let that = this
    this.setData({
      latitude: wx.getStorageSync('latitude'),
      longitude: wx.getStorageSync('longitude'),
      adcode: wx.getStorageSync('adcode'),
      map: true
    },() => {
      // 实例化API核心类
      qqmapsdk = new QQMapWX({
        key: 'G4BBZ-NDHKO-GAQWR-SS5O5-VIZ7Q-PPFO7'
      });

      that.moveToLocation();
    })
    
  },
  //移动选点
  moveToLocation: function () {
    var that = this;
    let adcode = ''
    let locationIndex = ''
    let name = ''
    wx.chooseLocation({
      success: function (res) {
        console.log(res);
        locationIndex = res.latitude+','+res.longitude
        name =  res.name
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success:(res2) => {
            console.log('reverseGeocoder---解析选中地址成功---')
            adcode = res2.result.ad_info.adcode
            // 选择地点之后返回到原来页面
            wx.navigateTo({
              url: `/pages/share/share?adcode=${adcode}&locationIndex=${locationIndex}&name=${name}`
            });
          }
        })
        
      },
      fail: function (err) {
        wx.navigateBack({})
      }
    });
  }
});