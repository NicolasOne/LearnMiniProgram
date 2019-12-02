// pages/category/category.js
import {
  getCardListData,
  collectCard
} from '../../service/card.js'
const App = getApp();
const utils = require('../../utils/utils.js');
const formatTime = utils.formatDateTimes;
import QQMapWX from '../../utils/qqmap-wx-jssdk.js'
let qqmapsdk = new QQMapWX({
  key: 'G4BBZ-NDHKO-GAQWR-SS5O5-VIZ7Q-PPFO7'
})
Component({

  /**
   * 页面的初始数据
   */
  
  data: {
    shares: [],
    start: 0,
    loading: false,
    windowWidth: App.globalData.windowWidth,
    windowHeight: App.globalData.windowHeight,
    nowCity: wx.getStorageSync('nowCity'),
    locationCity: wx.getStorageSync('nowCity'),
    // 热门城市列表
    hotCityData: [
      {
        "id": "110000",
        "name": "北京",
        "fullname": "北京市",
        "pinyin": [
            "bei",
            "jing"
        ],
        "location": {
            "lat": 39.90469,
            "lng": 116.40717
        },
        "cidx": [
            0,
            15
        ]
      },
      {
          "id": "120000",
          "name": "天津",
          "fullname": "天津市",
          "pinyin": [
              "tian",
              "jin"
          ],
          "location": {
              "lat": 39.0851,
              "lng": 117.19937
          },
          "cidx": [
              16,
              31
          ]
      },
      {
        "id": "310000",
        "name": "上海",
        "fullname": "上海市",
        "pinyin": [
            "shang",
            "hai"
        ],
        "location": {
            "lat": 31.23037,
            "lng": 121.4737
        },
        "cidx": [
            102,
            117
        ]
      },
      {
        "id": "500000",
        "name": "重庆",
        "fullname": "重庆市",
        "pinyin": [
            "chong",
            "qing"
        ],
        "location": {
            "lat": 29.56471,
            "lng": 106.55073
        },
        "cidx": [
            297,
            334
        ]
      },
      {
        "id": "510100",
        "name": "成都",
        "fullname": "成都市",
        "pinyin": ["cheng", "du"],
        "location": {lat: 30.5702, lng: 104.06476},
        "cidx": [1915, 1934]
      },
      {
        "id": "440100",
        "name": "广州",
        "fullname": "广州市",
        "pinyin": ["guang", "zhou"],
        "location": {lat: 23.12908, lng: 113.26436},
        "cidx": [1667, 1677]
      },
      {
        "id": "440300",
        "name": "深圳",
        "fullname": "深圳市",
        "pinyin": ["shen", "zhen"],
        "location": {lat: 22.54286, lng: 114.05956},
        "cidx": [1688, 1696]
      }
    ],
    // 全部城市列表
    cityData:[],
    location:{
      latitude: '',
      longitude: ''
    },
    // 大写letter列表
    keyArr: [],
    // 小写列表
    sortKeyArrLow: [],
    // 右侧字母列表
    rightList:[],
    scrollTopId: 'now',
    showPy: '',
    // 是否展示城市列表
    isShowCity:false,
    searchValue: null,
    // 城市code
    areaCode: wx.getStorageSync('adcode'),
    pageSize: 10,
    currPage: 1,
    collectList: {},
    totalRecord: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  methods: {
    //选择城市
   selectCity: function (e) {
     let that = this
      var dataset = e.currentTarget.dataset;
      console.log(e.currentTarget.dataset.id)
      this.setData({
          nowCity: dataset.fullname,
          location: {
            latitude: dataset.lat,
            longitude: dataset.lng
          },
          areaCode: dataset.id,
          isShowCity: false,
          currPage: 1,
          shares: [],
          totalRecord: 0
      },() => {
        let { currPage, pageSize, searchValue, areaCode } = that.data
        this._getCardListDataInfo(null, true, currPage, pageSize, searchValue, areaCode);
      });
    },
    clickCollect(e){
      console.log(e.currentTarget.dataset.id)
      wx.request({
        url: "https://www.jikedd.com/eatStreets/card/collectCard?cardId="+e.currentTarget.dataset.id,
        data: {},
        method: 'POST',
        header: {
          token: wx.getStorageSync('token')
       },
       success: () => {
        this.setData({
          collectList: {
            ...this.data.collectList,
            [e.currentTarget.dataset.id]: !this.data.collectList[e.currentTarget.dataset.id]
          }
        },() => console.log(this.data.collectList))
       }
      })
      // console.log(e.currentTarget.dataset.id)
      // collectCard(e.currentTarget.dataset.id).then(res => {
        
      // })
    },
    onPullDownRefresh() {
      let { currPage, pageSize, searchValue, areaCode } = this.data
      this._getCardListDataInfo(null, true, 1, pageSize, searchValue, areaCode);
    },
    onReachBottom: function () {
      let { currPage, pageSize, searchValue, areaCode } = this.data
      this._getCardListDataInfo(null, false, currPage, pageSize, searchValue, areaCode);
    },
    _getCardListDataInfo(e, needRefresh, currPage, pageSize, searchValue, areaCode) {
      const self = this;
      if (!needRefresh){
        if (self.data.totalRecord > self.data.shares.length || 0) {
          console.log(currPage, pageSize,'searchValue')
          let currPa = self.data.currPage + 1
          getCardListData(currPa, self.data.pageSize, self.data.searchValue, self.data.areaCode).then(res => {
            res.data.data.data && res.data.data.data.map((share) => {
              const item = share;
              item.ctime = formatTime(new Date(item.ctime));
              return item;
            });
            let newList = [...self.data.shares, ...res.data.data.data];
            self.setData({
              shares: newList,
              totalRecord: res.data.data.totalRecord
            }, () => {
              let newCollectList = self.data.collectList
              self.data.shares.map(item => {
                newCollectList[item.id] = item.collect
              })
              self.setData({
                collectList: newCollectList
              })
            });
          })
        } else {
          wx.showToast({
            title: '已经到底啦~',
            icon: 'none'
          })
        }
      }else{
        getCardListData(currPage, pageSize, searchValue, areaCode).then(res => {
          console.log(currPage, pageSize, searchValue, areaCode,'currPage, pageSize, searchValue, areaCode')
          console.log(res,'rseresrse')
          let newList = res.data.data.data;
          newList && newList.map((share) => {
            const item = share;
            item.ctime = formatTime(new Date(item.ctime));
            return item;
          });
          self.setData({
            shares: newList,
            totalRecord: res.data.data.totalRecord
          }, () => {
            let newCollectList = self.data.collectList
            self.data.shares.map(item => {
              newCollectList[item.id] = item.collect
            })
            self.setData({
              collectList: newCollectList
            })
          });
        })
      }
      
      
    },
    //获取点击的字母
    getPy(e) {
      this.setData({
          showPy: e.target.id,
      })
    },
    //将设置到字母，赋值到scrollTopId
    setPy(e) {
      this.setData({
          scrollTopId: this.data.showPy
      })
    },
    //滑动时
    tMove: function (e) {
      var y = e.touches[0].clientY,
          offsettop = e.currentTarget.offsetTop,
          that = this;
      //判断选择区域,只有在选择区才会生效
      if (y > offsettop) {
          var num = parseInt((y - offsettop) / 18);
          this.setData({
              showPy: that.data.sortKeyArrLow[num]
          },() => console.log(this.data.showPy))
          };
    },
    toCardDetail(e){
     wx.navigateTo({
       url: '../cardDetail/cardDetail?id='+e.currentTarget.dataset.id,
     })
    },
    //触发全部开始选择
    tStart: function () {
    },

    //触发结束选择
    tEnd: function () {
        this.setData({
            scrollTopId: this.data.showPy
        })
    },
    // 判断是否展示城市列表
    isShowCity(){
      console.log('111')
      this.setData({
        isShowCity: !this.data.isShowCity
      })
    },
    // 获取input框中的值
    handleSearch(e){
      console.log(e.detail.value,'ee')
      this.setData({
        isShowCity: false,
        searchValue: e.detail.value
      },() => {
        let { currPage, pageSize, searchValue, areaCode } = this.data
        console.log(this.data,'this.data')
        this._getCardListDataInfo(null, true, 1, pageSize, searchValue, areaCode);
      })
      
    }
  },
  
  ready(){
    let { searchValue, currPage, pageSize, areaCode } = this.data
    let that = this
    getCardListData(currPage, pageSize, searchValue || null, areaCode || null).then(res => {
      let totalRecord = res.data.data.totalRecord
      let newList = res.data.data.data
      newList && newList.map((share) => {
        const item = share;
        item.ctime = formatTime(new Date(item.ctime));
        return item;
      });
      that.setData({
        shares: newList,
        totalRecord
      }, () => {
        let newCollectList = that.data.collectList
        that.data.shares.map(item => {
          newCollectList[item.id] = item.collect
        })
        that.setData({
          collectList: newCollectList
        },() => console.log(that.data.collectList,'collectList'))
      });
    })
    qqmapsdk.getCityList({
      success: function(res) {
        console.log(res,'resres')
        // 处理地图数据
        let cityData = [...res.result[1]]
        console.log(cityData,'cityData')
        cityData.map(item => {
          item.letter = item.pinyin[0].substr(0, 1)
          return item
        })
        let obj = {}
        cityData.forEach(item => {
            if (obj[item.letter.substring(0, 1)]) {
                obj[item.letter.substring(0, 1)].push(item)
            } else {
                obj[item.letter.substring(0, 1)] = [item]
            }
        });
        let keyArr = Object.keys(obj)
        let numArr = []
        keyArr.forEach(item => {
            numArr.push(item.charCodeAt())
        })
        numArr = numArr.sort((a,b) => a-b)
        let sortKeyArr = []
        let sortKeyArrLow = []
        numArr.forEach(item => {
            sortKeyArr.push(String.fromCharCode(item).toUpperCase())
            sortKeyArrLow.push(String.fromCharCode(item))
        })
        keyArr = sortKeyArr
        console.log(keyArr,'keyArr')
        console.log(obj,'obj')
        let rightList = []
        keyArr.forEach((item,index) => {
          rightList.push({id:sortKeyArrLow[index],name: [item]})
        })
        console.log(rightList,'rightList')
        let nowCity = wx.getStorageSync('nowCity')
        that.setData({
          nowCity,
          cityData: obj,
          keyArr,
          sortKeyArrLow,
          rightList
        })
      }
    })
    that.setData({
      scrollTopId: 'now'
    })
  }
})