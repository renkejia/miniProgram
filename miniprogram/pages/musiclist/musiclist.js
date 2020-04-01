// pages/musiclist/musiclist.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    musiclist: [],
    listinfo: {},
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('传歌单详情页参数:',options);
    wx.showLoading({
      title: '加载中',
    });

    wx.cloud.callFunction({
      name: 'music',
      data: {
        playlistId: options.playlistId,
        $url: 'musiclist'
      }
    }).then((res) => {
      console.log('musiclist请求成功',res);
      const { tracks, coverImgUrl, name} = res.result.playlist;
      this.setData({
        musiclist: tracks,
        listInfo: {
          coverImgUrl: coverImgUrl,
          name: name
        }
      })
      this._setMusiclist();
      wx.hideLoading();
    });
  },
  // 将歌单信息存到缓存中
  _setMusiclist() {
    wx.setStorageSync('musiclist', this.data.musiclist)
  }

})