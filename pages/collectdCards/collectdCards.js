// pages/collectdCards/collectdCards.js
import {
  getCardListData,
  collectCard,
  getMyCardByArea,
  getCollectCard
} from '../../service/card.js'
const utils = require('../../utils/utils.js');
const formatTime = utils.formatDateTimes;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cards: [],
    searchValue: '',
    areaCode: '',
    pageSize: 10,
    currPage: 1,
    chooseType: '收藏的卡片',
    collectList: {},
    awaysCards: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { currPage, pageSize} = this.data
    let self = this
    getCollectCard(currPage, pageSize).then(res => {
      console.log(res)
      let newList = res.data.data;
      newList && newList.map((share) => {
        const item = share;
        item.ctime = formatTime(new Date(item.ctime));
        return item;
      });
      self.setData({
        cards: newList,
        awaysCards: newList
      }, () => {
        let newCollectList = self.data.collectList
        console.log(self.data.cards, 's收藏')
        self.data.cards.map(item => {
          newCollectList[item.id] = item.collect
        })
        self.setData({
          collectList: newCollectList
        })
      });
    })
  },
  toCardDetail(e) {
    wx.navigateTo({
      url: '../cardDetail/cardDetail',
    })
  },
  chooseType(e){
    console.log(e.currentTarget.dataset.type,'e.currentTarget.dataset.type')
    this.setData({
      chooseType: e.currentTarget.dataset.type,
      cards: [],
      collectList: {}
    },() => this._getCardListDataInfo(null, true, 1, this.data.pageSize))
  },
  searchValueChange(e){
    let newCards = []
    this.data.awaysCards.map(item => {
      console.log(item,'item')
      if (item.eatStreetName && item.eatStreetName.indexOf(e.detail.value) != -1 || item.area&&item.area.indexOf(e.detail.value)!=-1){
        newCards.push(item)
      }
    })
    this.setData({
      cards: newCards
    })
  },
  clickCollect(e){
    console.log(e.currentTarget.dataset.id)
    collectCard(e.currentTarget.dataset.id).then(res => {
      this.setData({
        collectList: {
          ...this.data.collectList,
          [e.currentTarget.dataset.id]: !this.data.collectList[e.currentTarget.dataset.id]
        }
      },() => console.log(this.data.collectList))
    })
  },
  onPullDownRefresh() {
    let { currPage, pageSize } = this.data
    this._getCardListDataInfo(null, true, 1, pageSize);
  },
  onReachBottom: function () {
  },
  _getCardListDataInfo(e, needRefresh, currPage, pageSize) {
    const self = this;
    if(this.data.chooseType=='收藏的卡片'){
      console.log('shoucang')
      getCollectCard(currPage, pageSize).then(res => {
        let totalRecord = res.data.totalRecord
        let newList = res.data.data;
        newList && newList.map((share) => {
          const item = share;
          item.ctime = formatTime(new Date(item.ctime));
          return item;
        })
        self.setData({
          cards: newList,
          currPage: currPage
        }, () => {
          let newCollectList = self.data.collectList
          console.log(self.data.cards, 's收藏')
          self.data.cards.map(item => {
            newCollectList[item.id] = item.collect
          })
          self.setData({
            collectList: newCollectList
          })
        });
      })
    }else {
      getMyCardByArea(currPage, pageSize).then(res => {
        console.log(res)
        let totalRecord = res.data.totalRecord
        let newList = res.data.data
        newList && newList.map((share) => {
          const item = share;
          item.ctime = formatTime(new Date(item.ctime));
          return item;
        })
        self.setData({
          cards: newList,
          currPage: currPage
        }, () => {
          let newCollectList = self.data.collectList
          console.log(self.data.cards)
          self.data.cards.map(item => {
            newCollectList[item.id] = item.collect
          })
          self.setData({
            collectList: newCollectList
          })
        });
      })
    }
    
  }
})