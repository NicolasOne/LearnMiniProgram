// pages/profile/profile.js
import {
  getBrowseCountAndLikeCount
} from '../../service/user.js'
Component({
 /**
   * 组件的属性列表
   */
  properties: {
    showNews:{
      type: Boolean,
      value: ''
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl:'',
    nickName: '',
    isAuthorization: '',
    likeCount: '',
    browseCount: ''
  },
  methods:{
    //事件处理函数
    goAuthorization(){
      wx.redirectTo({
        url: '../login/login'
      })
    },
    // 跳转卡片收藏页
    toCollectdCards(){
      wx.navigateTo({
        url: '../collectdCards/collectdCards',
      })
    },
    // 跳转分享列表
    toMyShare(){
      wx.navigateTo({
        url: '../myShare/myShare',
      })
    },
    toMyNotification(){
      wx.navigateTo({
        url: '../myNotification/myNotification',
      })
    },
    // 跳意见反馈页
    toFeedback(){
      wx.navigateTo({
        url: '../feedbackPage/feedbackPage',
      })
    }
  },
  ready(){
    let that = this
    getBrowseCountAndLikeCount().then(res => {
      let likeCount = res.data.data.likeCount
      let browseCount = res.data.data.browseCount
      that.setData({
        avatarUrl: wx.getStorageSync('avatarUrl'),
        nickName: wx.getStorageSync('nickName'),
        isAuthorization: wx.getStorageSync('isAuthorization'),
        likeCount,
        browseCount
      })
    })
    
  }
  
})