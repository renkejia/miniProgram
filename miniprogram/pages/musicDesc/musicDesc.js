// pages/musicDesc/musicDesc.js
let musiclist = [];
// 正在播放歌曲index
let nowPlayingIndex = 0;
// 正在播放时间 单位秒
let currentTime = 0;
// 获取全局唯一的背景音乐管理器
const backgroundAudioManager = wx.getBackgroundAudioManager();
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    isPlaying: false, // 默认不播放
    isLyricShow: false, //当前歌词是否显示
    lyric: '', // 歌词
    isSame: false, //是否为同一首歌
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('歌单页面传递的参数', options);
    // 获取当前索引
    nowPlayingIndex = options.index;
    musiclist = wx.getStorageSync('musiclist');
    this._loadMusicDescInfo(options.musicid);
    // (ios系统点击上一首)
    backgroundAudioManager.onPrev(() => {
      this.onPrev();
    });
    // (ios系统点击下一首)
    backgroundAudioManager.onNext(() => {
      this.onNext();
    });
  },

  // 加载歌曲信息
  _loadMusicDescInfo(musicId) {
    if (app.getPlayMusicId() == musicId) {
      this.setData({
        isSame: true,
      });
    } else {
      this.setData({
        isSame: false,
      })
      backgroundAudioManager.stop();
    }
    // 当前歌曲信息
    const musicInfo = musiclist[nowPlayingIndex];
    console.log('当前歌曲信息：', musicInfo);
    // 设置导航栏标题
    wx.setNavigationBarTitle({
      title: musicInfo.name,
    });
    this.setData({
      picUrl: musicInfo.al.picUrl,
      isPlaying: false,
    });

    wx.showLoading({
      title: '歌曲加载中',
    })
    // 设置全局变量当前歌曲id
    app.setPlayMusicId(musicId);
    // 调用云函数
    wx.cloud.callFunction({
      name: 'music',
      data: {
        musicId,
        $url: 'musicUrl',
      }
    }).then((res) => {
      console.log('从云函数请求歌曲信息：', JSON.parse(res.result));
      let result = JSON.parse(res.result);
      if (result.data[0].url == null) {
        wx.showToast({
          title: '请登录',
        })
        return
      }
      if (!this.data.isSame) {
        // 设置播放歌曲名称
        backgroundAudioManager.title = musicInfo.name;
        // 设置歌曲链接
        backgroundAudioManager.src = result.data[0].url;
        // 设置歌曲封面
        backgroundAudioManager.coverImgUrl = musicInfo.al.picUrl;
        // 设置歌手
        backgroundAudioManager.singer = musicInfo.ar[0].name;
        // 设置专辑名称
        backgroundAudioManager.epname = musicInfo.al.name;

        // 保存播放历史
        this.savePlayHistory();
      }
      this.setData({
        isPlaying: true,
      })
      wx.hideLoading();
    });

    // 加载歌词
    wx.cloud.callFunction({
      name: 'music',
      data: {
        musicId,
        $url: 'lyric',
      }
    }).then((res) => {
      let lyric = '暂无歌词';
      let lrc = JSON.parse(res.result).lrc;
      console.log('获取歌词成功', lrc);
      if (lrc) {
        lyric = lrc.lyric;
      }
      this.setData({
        lyric,
      })
    });

    return musicInfo;
  },

  // 点击暂停或播放
  changePlaying() {
    if (this.data.isPlaying) {
      // 暂停
      backgroundAudioManager.pause();
    } else {
      // 播放
      backgroundAudioManager.play();
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },

  // 点击上一首
  onPrev() {
    if (nowPlayingIndex == 0) {
      nowPlayingIndex = musiclist.length - 1;
    } else {
      nowPlayingIndex--;
    }
    this._loadMusicDescInfo(musiclist[nowPlayingIndex].id);

  },
  // 点击下一首
  onNext() {
    if (nowPlayingIndex === musiclist.length) {
      nowPlayingIndex = 0;
    } else {
      nowPlayingIndex++;
    }
    this._loadMusicDescInfo(musiclist[nowPlayingIndex].id);
  },

  onChangeLyricShow() {
    this.setData({
      isLyricShow: !this.data.isLyricShow,
    })
  },
  // 传递currentTime到lyric组件
  timeUpdata(event) {
    // console.log('给歌词组件传递的cuttentTime',event)
    this.selectComponent('.lyric').update(event.detail.currentTime);
  },

  // 联动控制台控制歌曲播放暂停
  onPlay() {
    this.setData({
      isPlaying: true,
    })
    app.setIsPause(false);
  },
  onPause() {
    this.setData({
      isPlaying: false,
    })
    app.setIsPause(true);
  },

  // 保存播放历史
  savePlayHistory() {
    // 当前正在播放的歌曲
    const music = musiclist[nowPlayingIndex];
    const openid = app.globalData.openid;
    const history = wx.getStorageSync(openid);
    let ishave = false;
    for (let i = 0; i < history.length; i++) {
      if (history[i].id == music.id) {
        ishave = true;
        break;
      }
    }
    // 如果结束遍历ishave为false，那么将当前歌曲添加至history里
    if(!ishave) {
      history.unshift(music);
      wx.setStorage({
        key: openid,
        data: history,
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})