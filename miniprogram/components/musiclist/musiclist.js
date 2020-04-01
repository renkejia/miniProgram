// components/musiclist/musiclist.js
const app = getApp();
const backgroundAudioManager = wx.getBackgroundAudioManager();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    musicId: -1,

  },
  // 页面生命周期
  pageLifetimes: {
    show: function() {
      // 页面被展示
      this.setData({
        musicId: app.getPlayMusicId(),
      });
      // console.log('高亮musicId:', this.data.musicId)
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 点击歌曲事件
    onSelect(event) {
      const {
        musicid,
        index
      } = event.currentTarget.dataset;
      // 如果当前点击为同一首歌
      if (musicid == this.data.musicId) {
        // 如果现在为暂停，及点击歌曲就播放
        if (app.getIsPause()) {
          backgroundAudioManager.play();
        }
      } else {
        this.setData({
          musicId: musicid,
        });
      }
      wx.navigateTo({
        url: `../../pages/musicDesc/musicDesc?musicid=${musicid}&index=${index}`,
      });
    },
  }
})