//index.js
//获取应用实例
const app = getApp()

// Page({
//   data: {
    
//   },
//   onLoad:function(options) {
//     this.timeLazyLoading()
//   },
//   timeLazyLoading() {
//     setTimeout(function () {
//       wx.switchTab({
//         url: '../../pages/home/home',
//       })
//     }, 2000)
//   }
// })


Page({
  data: {
    time: 3
  },
  onLoad: function () {
    var count = setInterval(() => {
      this.setData({
        time: this.data.time - 1
      });
      if (this.data.time == 0) {
        wx.switchTab({
          url: '../../pages/home/home',
          complete: function (res) {
          }
        })
        clearInterval(count);
      }
    }, 1000);
  }
})
