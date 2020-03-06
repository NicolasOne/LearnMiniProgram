
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
            pagePath: "/pages/home/home",
            text: '首页',
            iconPath: "/assets/tabbar/index.png",
            selectIconPath: "/assets/tabbar/index_active.png",
            selected: true
          },
          {
            id: TabbarList.category,
            pagePath: "/pages/category/category",
            text: '卡片',
            iconPath: "/assets/tabbar/category.png",
            selectIconPath: "/assets/tabbar/category_active.png",
            selected: false
          },
          {
            id: TabbarList.square,
            pagePath: "/pages/square/square",
            text: '广场',
            iconPath: "/assets/tabbar/search.png",
            selectIconPath: "/assets/tabbar/search_active.png",
            selected: false,
          },
          {
            id: TabbarList.profile,
            pagePath: "/pages/profile/profile",
            text: '我的',
            iconPath: "/assets/tabbar/home.png",
            selectIconPath: "/assets/tabbar/home_active.png",
            selected: false
          }
        ]
      } else {
        list = [
          {
            id: TabbarList.home,
            pagePath: "/pages/home/home",
            text: '首页',
            iconPath: "/assets/tabbar/index.png",
            selectIconPath: "/assets/tabbar/index_active.png",
            selected: true
          },
          {
            id: TabbarList.category,
            pagePath: "/pages/category/category",
            text: '卡片',
            iconPath: "/assets/tabbar/category.png",
            selectIconPath: "/assets/tabbar/category_active.png",
            selected: false
          },
          {
            id: TabbarList.profile,
            pagePath: "/pages/profile/profile",
            text: '我的',
            iconPath: "/assets/tabbar/home.png",
            selectIconPath: "/assets/tabbar/home_active.png",
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