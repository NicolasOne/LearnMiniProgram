// pages/feedbackPage/feedbackPage.js
import { baseURL } from '../../service/config.js';
import { saveFeedback } from '../../service/user'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
    imgLists: [],
    count: 0,
    content: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  changeFeedback(e){
    this.setData({
      content:e.detail.value
    })
  },
  addFeedback(){
    let params  = {
      info: this.data.content,
      // type: null,
      imgPath: this.data.imgLists
    }
    saveFeedback(params).then(res => {
      if(res.data.status==1){
        wx.showModal({
          title: '提示',
          content: '提交成功',
          showCancel: false,
          success: (res) => {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      }else{
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          showCancel: false,
          success: (res) => {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      }
    })
  },
  // 添加图片
  chooseimage(){
    let that = this
    let count = 9 - this.data.imgList.length;
    wx.chooseImage({
      count: count, // 默认9 
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
      success: function (res) {
        console.log(res,'res')
        let imgList = res.tempFilePaths
        console.log(imgList,'imgList')
        that.setData({
          imgList,
          count: imgList.length       
        })
        that.uploadimg({
          url: baseURL+'/share/upload', //这里是你图片上传的接口
          path: imgList, //这里是选取的图片的地址数组
        })
      }
    })
  },
  //多张图片上传

uploadimg(data){
  let that=this
  let imgLists = that.data.imgLists   
  if(data.path.length>0){
    data.path.forEach(item => {
      wx.uploadFile({
        url: data.url, 
        filePath: item,
        header:{'content-type':'multipart/form-data'},
        name: 'fileData',
        formData:null,
        success: (resp) => {
        console.log(resp,'resresrseres')                              
          imgLists.push(JSON.parse(resp.data).data)
          that.setData({
            imgLists             
          }, () => {  
            wx.setStorageSync('imgLists', JSON.stringify(imgLists))
          })
        //这里可能有BUG，失败也会执行这里
        }
      });
    })
  }else {
    wx.uploadFile({
      url: data.url, 
      filePath: data.path,
      header:{'content-type':'multipart/form-data'},
      name: 'fileData',
      formData:null,
      success: (resp) => {
      console.log(resp,'resresrseres')                              
        imgLists.push(JSON.parse(resp.data).data)
        that.setData({
          imgLists             
        }, () => {  
          wx.setStorageSync('imgLists', JSON.stringify(imgLists))
        })
      //这里可能有BUG，失败也会执行这里
      }
    });
  }
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