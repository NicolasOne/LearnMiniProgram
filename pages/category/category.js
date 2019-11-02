// pages/category/category.js
import {
  getCardListData
} from '../../service/card.js'
const App = getApp();
const utils = require('../../utils/utils.js');
const formatTime = utils.formatDateTimes;
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    shares: [],
    start: 0,
    loading: false,
    windowWidth: App.globalData.windowWidth,
    windowHeight: App.globalData.windowHeight,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {   
    this._getCardListDataInfo()
  },
  onPullDownRefresh() {
    this._getCardListDataInfo(null, true);
  },
  _getCardListDataInfo(e, needRefresh) {
    const self = this;
    const loading = self.data.loading;
    const data = {
      next_start: self.data.start,
    };
    if (loading) {
      return;
    }
    self.setData({
      loading: true,
    });
    getCardListData(1,10).then(res => {
      console.log(res)
      let newList = res.data.data.data;
      newList.map((share) => {
        const item = share;
        item.ctime = formatTime(new Date(item.ctime));
        return item;
      });
      if (needRefresh) {
        wx.stopPullDownRefresh();
      } else {
        newList = self.data.shares.concat(newList);
      }
      self.setData({
        shares: newList,
      });
      const nextStart = res.data.data.next_start;
      self.setData({
        start: nextStart,
        loading: false,
      });
    })
  }
})