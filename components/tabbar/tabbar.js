
import { TabbarList } from '../../utils/enum.js';
import {
  user
} from '../../service/user.js'
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabbarID: {
      type: Number,
      value: 1
    },
    showNews:{
      type: Boolean,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabbarRep: {
        color: "#999",
        selectedColor: "#000",
        backgroundColor: "#ffffff",
        borderStyle: "#DFDFE0",
        list: [],
      position: "bottom"
    },
    tabbar: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClickTabbar: function(e){
      let currentPages = getCurrentPages();
      let pagePath = currentPages[currentPages.length - 1].route;
      let tabbar = this.data.tabbarRep
      for (var i in tabbar.list) {
        if (tabbar.list[i].id == e.currentTarget.dataset.id) {
          tabbar.list[i].selected = true;
        }else{
          tabbar.list[i].selected = false;
        }
      }
      this.setData({tabbar: tabbar});

      var myEventDetail = { id: e.currentTarget.dataset.id }; // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('onclick', myEventDetail, myEventOption)
    },
    setTabbarSel: function (id) {
      let currentPages = getCurrentPages();
      let pagePath = currentPages[currentPages.length - 1].route;
      let tabbar = this.data.tabbarRep 
      for (var i in tabbar.list) {
        if (tabbar.list[i].id == id) {
          tabbar.list[i].selected = true;
        } else {
          tabbar.list[i].selected = false;
        }
      }
      this.setData({ tabbar: tabbar });
    },
    toCompileNews: () => {
      if(wx.getStorageSync('isAuthorization')){
        wx.navigateTo({
          url: '../share/share',
        })
      }else{
        app.globalData.toAuthorization()
      }
    }
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () {},
  moved: function () { },
  ready: function () { 
    let list = []
    user().then(res => {
      if (res.data.data) {
        list = [
          {
            id: TabbarList.home,
            pagePath: "/pages/category/category",
            text: '首页',
            iconPath: "/assets/tabbar/home.png",
            selectIconPath: "/assets/tabbar/home_select.png",
            selected: true
          },
          {
            id: TabbarList.category,
            pagePath: "/pages/home/home",
            text: '社区',
            iconPath: "/assets/tabbar/community.png",
            selectIconPath: "/assets/tabbar/community_select.png",
            selected: false
          },
          {
            id: TabbarList.rank,
            pagePath: "/pages/rank/rank",
            text: '排行榜',
            iconPath: "/assets/tabbar/rank.png",
            selectIconPath: "/assets/tabbar/rank_select.png",
            selected: false,
          },
          {
            id: TabbarList.profile,
            pagePath: "/pages/profile/profile",
            text: '我的',
            iconPath: "/assets/tabbar/mine.png",
            selectIconPath: "/assets/tabbar/mine_select.png",
            selected: false
          }
        ]
      } else {
        list = [
          {
            id: TabbarList.home,
            pagePath: "/pages/category/category",
            text: '首页',
            iconPath: "/assets/tabbar/home.png",
            selectIconPath: "/assets/tabbar/home_select.png",
            selected: true
          },
          {
            id: TabbarList.category,
            pagePath: "/pages/home/home",
            text: '社区',
            iconPath: "/assets/tabbar/community.png",
            selectIconPath: "/assets/tabbar/community_select.png",
            selected: false
          },
          {
            id: TabbarList.profile,
            pagePath: "/pages/profile/profile",
            text: '我的',
            iconPath: "/assets/tabbar/mine.png",
            selectIconPath: "/assets/tabbar/mine_select.png",
            selected: false
          }
        ]
      }
      wx.setStorageSync('user', res.data.data)
      this.setData({
        user: res.data.data,
        tabbarRep: { ...this.data.tabbarRep, list }
      },() => {
        let currentPages = getCurrentPages();
        let pagePath = currentPages[currentPages.length - 1].route;
        let tabbar = this.data.tabbarRep
        for (var i in tabbar.list) {
          if (tabbar.list[i].id == this.properties.tabbarID) {
            tabbar.list[i].selected = true;
          } else {
            tabbar.list[i].selected = false;
          }
        }
        this.setData({ tabbar: tabbar });
      })
    })
    
    
    
  },
  detached: function () {},
})