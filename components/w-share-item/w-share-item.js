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
    },
    showDetailBtn: {
      type: Boolean,
      value: '',
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
    model: App.globalData.model,
    changeLike: {},
    likeList:{},
    isShare: '',
    showDetailBtn: false
  },
  ready(){
    if(wx.getStorageSync('isAuthorization')){
      this.setData({
        isShare: 'share'
      })
    }
    this.setData({
      user: wx.getStorageSync('user')
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    toCardDetail(e){
      wx.navigateTo({
        url: '../cardDetail/cardDetail?id='+e.currentTarget.dataset.id,
      })
    },
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
      console.log(e,'0000')
      var that = this,
      index = e.currentTarget.dataset.index;
      let showIndex = {...this.data.showIndex}
      showIndex[index] = e.currentTarget.dataset.flag
      this.setData({
        showIndex
      },console.log(this.data.showIndex,'show'))
    },
    
    //------------ --------------点赞功能 点赞函数  获取对应id-----------------------------
    thumbsup: function (e) {
      console.log(e)
      if(wx.getStorageSync('isAuthorization')){
        var shareId = e.currentTarget.dataset.id; 
        var liked = e.currentTarget.dataset.liked;
        var thumbsUp = e.currentTarget.dataset.num;
        var src = e.currentTarget.dataset.src;
        this.zan(shareId,this.data.likeList[shareId]);
      }else {
        App.globalData.toAuthorization()
      }
    },
    //点赞处理函数    
    zan: function (shareId,liked) {
      var that = this;
      if(liked==true){
        wx.showToast({
          title: "取消点赞",
          icon: 'cancel'
        })
      }else {
        wx.showToast({
          title: "点赞成功",
          icon: 'cancel'
        })
      }
      //和后台交互，后台数据要同步
        that._thumpUp(shareId)
        that._getDetailData(shareId)
    },
    _thumpUp(commentId) {
      thumbUp(commentId).then(res => {
        this.setData({
          changeLike:{
            ...this.data.changeLike,
            [commentId]: true
          },
          likeList:{
            ...this.data.likeList,
            [commentId]:res.data.data
          }
        },() => console.log(this.data.changeLike))
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
    // 跳转内容详情页
    toNewsDetail:(e) => {
      if(wx.getStorageSync('isAuthorization')){
        console.log(e)
        wx.navigateTo({
          url: '/pages/detail/detail?shareId='+e.currentTarget.dataset.id,
        })
      }else {
        App.globalData.toAuthorization()
      }
    },
    // 转发判断授权状态
    toShare(){
      if(!this.data.isShare){
        App.globalData.toAuthorization()
      }
    }
  }

})
