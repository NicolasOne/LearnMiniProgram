// pages/share/share.js

import {
  addShare,
  getTagList,
  getSameCard
} from '../../service/home.js'
import { baseURL } from '../../service/config.js';
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
    imgLists: [],
    count: 0,
    tagList: [],
    chooesTagList: [],
    shopName: '',
    locationIndex: '',
    content: '',
    adcode: ''
  },
  onLoad(options){
    console.log(options)
    this.setData({
      shopName: options.name||'',
      locationIndex: options.locationIndex||'',
      adcode: options.adcode||''
    })
  },
  onShow(){
    console.log(wx.getStorageSync('imgList'),'json')
    this.setData({
      content: wx.getStorageSync('content')||'',
      chooesTagList: wx.getStorageSync('chooesTagList')?JSON.parse(wx.getStorageSync('chooesTagList')):[],
      imgLists: wx.getStorageSync('imgLists') ? JSON.parse(wx.getStorageSync('imgLists')):[]
    })
  },
  onUnload(){
    wx.removeStorageSync('content')
    wx.removeStorageSync('chooesTagList')
  },
  // 跳转地图页
  toMapPage(){
    wx.navigateTo({
      url: '../mapPage/mapPage',
    })
  },
  // 分享内容
  changeShareContent(e){
    wx.setStorageSync('content',e.detail.value)
    this.setData({
      content: e.detail.value
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
  // wx.uploadFile({
  //   url: data.url, 
  //   filePath: data.path,
  //   header:{'content-type':'multipart/form-data'},
  //   name: 'fileData',
  //   formData:null,
  //   success: (resp) => {
  //   success++;
  //   console.log(resp,'resresrseres')                              
  //     imgLists.push(JSON.parse(resp.data).data)
  //     that.setData({
  //       imgLists             
  //     }, () => {  
  //       wx.setStorageSync('imgLists', JSON.stringify(imgLists))
  //     })
  //   //这里可能有BUG，失败也会执行这里
  //   },
  //   fail: (res) => {
  //   fail++;
  //   console.log('fail:'+that.i+"fail:"+fail);
  //   },
  //   complete: (res) => {
  //     console.log('执行完毕');
  //     console.log('成功：'+success+" 失败："+fail);
  //   }
  // });
},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    getTagList().then(res => {
      let tagList = [...res.data.data]
      tagList.map(item => {
        if(this.data.chooesTagList.indexOf(item.tagId)!=-1){
          item.show = true
        }else{
          item.show = false
        }
        return item
      })
      this.setData({
        tagList
      })
    })
  },
  chooseTag(e){
    let chooesTagList = [...this.data.chooesTagList]
    if(chooesTagList.indexOf(e.currentTarget.dataset.id)==-1){
      chooesTagList.push(e.currentTarget.dataset.id)
    }else {
      chooesTagList.splice(chooesTagList.indexOf(e.currentTarget.dataset.id),1)
    }
    let tagList = [...this.data.tagList]
    tagList.map(item => {
      if(item.tagId==e.currentTarget.dataset.id){
        item.show = !item.show
      }
      return item
    })
    wx.setStorageSync('chooesTagList',JSON.stringify(chooesTagList))
    this.setData({
      tagList,
      chooesTagList
    })
  },
  toIssue(){
    let { adcode, locationIndex, content, chooesTagList, imgLists, shopName } = this.data
    if (content){
      if(shopName){
        addShare(adcode, locationIndex, content, chooesTagList, imgLists).then(res => {
          let list = {
            adcode,
            locationIndex,
            shopName,
            shareId: res.data.data
          }
          getSameCard(shopName, adcode, locationIndex).then(res2 => {
            console.log(res2.data.data,'res2')
            if(res2.data.data.length!=0){
              wx.navigateTo({
                url: '../shopList/shopList?list=' + JSON.stringify(res2.data.data) + '&shareId=' + res.data.data + '&detail=' + JSON.stringify(list),
              })
            }else{
              wx.navigateTo({
                url: '../createShop/createShop?list=' + JSON.stringify(list),
              })
              console.log('createCard')
            }
          })
        })
      }else{
        wx.showModal({
          title: '提示',
          content: '请选择商家位置',
        })
      }
    }else{
      wx.showModal({
        title: '提示',
        content: '内容不能为空哦~',
      })
    }
  }
})