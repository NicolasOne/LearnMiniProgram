import {
  baseURL
} from './config.js'
export default function (options) {
  var app = getApp();
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseURL + options.url,
      method: options.method || 'get',
      header: {
         token: app.globalData.token
      },
      data: options.data || {},
      success: resolve,
      fail: reject
    })
  })
} 

