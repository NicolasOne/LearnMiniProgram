// components/w-share-item/w-share-item.js
import {
  thumbUp
} from '../../service/home.js'
import {
  getDetailData
} from '../../service/detail.js'
const App = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {},
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    like: "/assets/other/zan_like.png",
    unlike:"/assets/other/zan.png",
    isTrue:true,
    num:0,
    model: App.globalData.model
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //预览图片
    topic_preview(e) {
      var that = this;
      var id = e.currentTarget.dataset.id;
      console.log(e)
      var url = e.currentTarget.dataset.url;
      var item = e.currentTarget.dataset.item;
      var previewImgArr = [];
      //通过循环在数据链里面找到和这个id相同的这一组数据，然后再取出这一组数据当中的图片
      wx.previewImage({
        current: url, // 当前显示图片的http链接
        urls: item // 需要预览的图片http链接列表
      })
    },
    toggleShow: function (e) {
      console.log(e)
      var that = this,
      index = e.currentTarget.dataset.index;
      this.data.showIndex[index] = !this.data.showIndex[index];
      this.setData({
        showIndex: this.data.showIndex
      })
    },
    
    //------------ --------------点赞功能 点赞函数  获取对应id-----------------------------
    thumbsup: function (e) {
      console.log(e)
      var shareId = e.currentTarget.dataset.id; 
      var liked = e.currentTarget.dataset.liked;
      var thumbsUp = e.currentTarget.dataset.num;
      var src = e.currentTarget.dataset.src;
      this.zan(shareId,liked);
      //wx.setStorageSync(shareId, true)
    },
    //点赞处理函数    
    zan: function (shareId,liked) {
      var that = this;
      that.setData({
        isTrue: true
      })
      if(liked==true){
        if (liked && that.data.isTrue) {
          that.setData({
            like: "/assets/other/zan.png",
            isTrue: false
          })
          wx.showToast({
            title: "取消点赞",
            icon: 'cancel'
          })
        } else {
          that.setData({
            like: "/assets/other/zan_like.png",
            isTrue: true
          })
          wx.showToast({
            title: "点赞成功",
            icon: 'sucess'
          })
        }
      }else {
        console.log(that.data.isTrue)
        if (!liked && that.data.isTrue) {
          that.setData({
            like: "/assets/other/zan_like.png",
            isTrue: false
          })
          wx.showToast({
            title: "点赞成功",
            icon: 'cancel'
          })
        } else {
          that.setData({
            like: "/assets/other/zan.png",
            isTrue: true
          })
          wx.showToast({
            title: "点赞失败",
            icon: 'sucess'
          })
        }
      }
      //和后台交互，后台数据要同步
        that._thumpUp(shareId)
        that._getDetailData(shareId)
    },
    _thumpUp(commentId) {
      thumbUp(commentId).then(res => {
        this.setData({
          commentId
        })
      })
    },
    _getDetailData(shareId) {
      getDetailData(shareId).then(res => {
        console.log(res)
        const commentList = res.data.data.commentList;
        const num = commentList.length;
        const thumbsUp = res.data.data.thumbsUp;
        this.setData({
          num: thumbsUp
        })
      })
    },
  }

})
