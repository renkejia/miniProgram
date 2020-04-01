// components/playlist/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playlist: {
      type: Object
    }
  },
  observers: {
    ['playlist.playCount'](value) {
      this.setData({
        _count: this._tranNum(value, 2)
      });
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    _count: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {

    //跳转歌单详情页
    goToMusiclist() {
      wx.navigateTo({
        url: `../../pages/musiclist/musiclist?playlistId=${this.properties.playlist.id}`,
      })
    },


    // 格式化听歌数
    _tranNum(num, point) {
      let numStr = num.toString().split('.')[0];
      if (numStr < 6) {
        return numStr;
      } else if (numStr.length >= 6 && numStr.length <= 8) {
        let decimal = numStr.substring(numStr.length - 4, numStr.length - 4 + point);
        return parseFloat(parseInt(num / 10000) + '.' + decimal) + '万';
      } else if (numStr.length > 8) {
        let decimal = numStr.substring(numStr.length - 8, numStr.length - 8 + point);
        return parseFloat(parseInt(num / 100000000) + '.' + decimal) + '亿';
      }
    }
  }
})