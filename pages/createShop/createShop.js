// pages/createShop/createShop.js
import { generate } from '../../service/home.js'
import { baseURL } from '../../service/config.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
    count: 0,
    content: '',
    createData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.list,'options')
    this.setData({
      createData: JSON.parse(options.list)
    })
  },
  changeShareContent(e){
    this.setData({
      content: e.detail.value
    })
  },
  // 添加图片
  chooseimage(){
    let that = this
    let count = 9 - this.data.imgList.length;
    let imgs = that.data.imgList
    wx.chooseImage({
      count: count, // 默认9 
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
      success: function (res) {
        console.log(res,'res')
        let imgList = [...imgs,...res.tempFilePaths]
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
    that.i=data.i?data.i:0
    let success=data.success?data.success:0
    let fail=data.fail?data.fail:0
    wx.uploadFile({
      url: data.url, 
      filePath: data.path[that.i],
      header:{'content-type':'multipart/form-data'},
      name: 'fileData',
      formData:null,
      success: (resp) => {
      success++;
      console.log(resp)
      console.log(that.i);
      //这里可能有BUG，失败也会执行这里
      },
      fail: (res) => {
      fail++;
      console.log('fail:'+that.i+"fail:"+fail);
      },
      complete: () => {
        that.i = that.i+1;
        if(that.i==data.path.length){ //当图片传完时，停止调用   
        console.log('执行完毕');
        console.log('成功：'+success+" 失败："+fail);
        }else{//若图片还没有传完，则继续调用函数
        console.log(data,'data');
        data.i=that.i;
        data.success=success;
        data.fail=fail;
        that.uploadimg(data);
        }
      }
    });
  },
  createCard(){
    if(this.data.content){
      let {adcode,locationIndex,shopName,shareId} = this.data.createData
      generate(shareId,shopName,this.data.content,locationIndex,adcode,this.data.imgList).then(res => {
        let tip = ''
        if (res.data.status==1){
          tip = '发布成功'
        }else{
          tip = '发布失败'
        }
        wx.removeStorageSync('chooesTagList')
        wx.removeStorageSync('imgList')
        wx.removeStorageSync('content')
        wx.showModal({
          title: '提示',
          content: tip,
          success(res) {
            if (res.confirm) {
              wx.redirectTo({
                url: '../main/main',
              })
            } else if (res.cancel) {
              wx.redirectTo({
                url: '../main/main',
              })
            }
          }
        })
        
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请填写商家介绍哦~',
      })
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