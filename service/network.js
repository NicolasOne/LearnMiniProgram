import {
  baseURL
} from './config.js'
export default function (options) {
  var app = getApp();
  wx.showLoading({
    title: '请稍候....',
    icon: 'none',
    mask: true
  })
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseURL + options.url,
      method: options.method || 'get',
      header: {
         token: wx.getStorageSync('token'),
         'content-type':options.url=='/pushMsg/readMsg'||options.url=='/card/getMyCardDetailByArea'?'application/x-www-form-urlencoded':'application/json'
      },
      data: options.data || {},
      success: resolve,
      fail: reject,
      complete: () => {
        wx.hideLoading()
      }
    })
  })
} 

