// components/w-tab-control/w-tab-control.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    titles: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentIndex: 0,
    animationData: {},
  },

  /**
   * 组件的方法列表
   */
  methods: {
    itemClick(e) {

      console.log(e)
      var index = e.currentTarget.dataset.index;
      // 初始化动画数据
      var animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out',
        delay: 0
      })
      console.log(index)
      // 距离左边位置
      animation.left((index * 350 + 70) + 'rpx').step()
      // 设置动画
      this.setData({
        animationData: animation.export()
      })

      // 1.设置最新的index
      this.setData({
        currentIndex: e.currentTarget.dataset.index
      },() => {
        wx.setStorageSync('homePageFlag', e.currentTarget.dataset.index)
        // 2.发出时间
        const data = {index: this.data.currentIndex}
        this.triggerEvent("tabclick", data, {})
      })
    }
  },
  ready(){
    if(wx.getStorageSync('homePageFlag')){
      this.setData({currentIndex: 1},() => {
        var animation = wx.createAnimation({
          duration: 500,
          timingFunction: 'ease-out',
          delay: 0
        })
        // 距离左边位置
        animation.left((1 * 350 + 70) + 'rpx').step()
        // 设置动画
        this.setData({
          animationData: animation.export()
        })
      })

    }
  }
})
