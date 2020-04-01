let movableAreaWidth = 0;
let movableViewWidth = 0;
const backgroundAudioManager = wx.getBackgroundAudioManager();
// 设置当前的秒数
let currentSec = -1;
// 当前歌曲的总时长 单位：秒
let duration = 0;
// 当前游标是否在移动，解决：当进度条拖动时和updateTime事件冲突问题
let isMoving = false;
// 当前currentTime
let currentTime = 0;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isPlaying:Boolean,
  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime: {
      currentTime: "00:00",
      totalTime: "00:00",
    },
    // 游标移动距离
    movableDis: 0,
    // 已播放进度移动距离
    progress: 0,
  },
  // 组件的生命周期函数
  lifetimes: {
    ready() {
      if(this.properties.isSame && this.data.showTime.totalTime == '00:00') {
        this._setTime();
      }
      this._getMovableDis();
      // 绑定播放音乐事件
      this._bindBGMEvent();
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {

    // 拖拽游标事件 
    onChange(event) {
      // console.log(event);
      // 拖动
      if (event.detail.source === "touch") {
        this.data.progress = event.detail.x / (movableAreaWidth - movableViewWidth) * 100;
        this.data.movableDis = event.detail.x;
        isMoving = true;
      }
    },
    // 用户鼠标移走事件(拖拽结束)，优化拖拽
    onTouchEnd() {
      const currentTimeFormat = this._dataFormat(Math.floor((backgroundAudioManager.currentTime)));
      this.setData({
        progress: this.data.progress,
        movableDis: this.data.movableDis,
        ['showTime.currentTime']: `${currentTimeFormat.min}:${currentTimeFormat.sec}`,
      })
      // 设置对应音乐播放是时长
      backgroundAudioManager.seek(duration * this.data.progress / 100); //秒为单位 
      isMoving = false;
    },


    // 获取游标移动距离
    _getMovableDis() {
      const query = this.createSelectorQuery()
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec((res) => {
        // 返回节点方位信息
        // console.log(res);
        movableAreaWidth = res[0].width;
        movableViewWidth = res[1].width;
      })
    },


    _bindBGMEvent() {
      // 监听背景音频进入可播放状态事件。
      backgroundAudioManager.onPlay(() => {
        // console.log('onPlay');
        this.triggerEvent('musicOnPlay');
        isMoving = false;
      })
      // 监听背景音频停止事件
      backgroundAudioManager.onStop(() => {
        console.log('onStop');
      })
      // 监听背景音频暂停事件
      backgroundAudioManager.onPause(() => {
        // console.log('Pause');
        this.triggerEvent('musicOnPause');
      })
      // 监听音频加载中事件。当音频因为数据不足，需要停下来加载时会触发
      backgroundAudioManager.onWaiting(() => {
        // console.log('onWaiting')
      })
      // 监听背景音频进入可播放状态事件。 但不保证后面可以流畅播放
      backgroundAudioManager.onCanplay(() => {
        // console.log('onCanplay')
        if (typeof backgroundAudioManager.duration != 'undefined') {
          this._setTime();
        } else {
          setTimeout(() => {
            this._setTime();
          }, 1000);
        }
      })
      // 监听背景音频播放进度更新事件，只有小程序在前台时会回调
      backgroundAudioManager.onTimeUpdate(() => {
        // console.log('onTimeUpdate');
        // 获取当前播放时间
        currentTime = backgroundAudioManager.currentTime
        // console.log('当前播放时间', currentTime);
        // 歌曲总时长
        const duration = backgroundAudioManager.duration;
        // console.log('歌曲总时长', duration);
        if (!isMoving) {
          // 当前秒数
          const sec = currentTime.toString().split('.')[0];
          if (sec != currentSec) {
            // 格式化currentTime
            const currentTimeFormat = this._dataFormat(currentTime)
            this.setData({
              movableDis: (movableAreaWidth - movableViewWidth) * currentTime / duration,
              progress: currentTime / duration * 100,
              ['showTime.currentTime']: `${currentTimeFormat.min}:${currentTimeFormat.sec}`,
            })
            currentSec = sec;
            this.triggerEvent('timeUpdata',{
              currentTime,
            });
          }
        }
      });
      // 监听背景音频自然播放结束事件
      backgroundAudioManager.onEnded(() => {
        // console.log("onEnded")
        this.triggerEvent('musicEnd');
      });
      // 监听背景音频播放错误事件
      backgroundAudioManager.onError((res) => {
        console.error(res.errMsg)
        console.error(res.errCode)
        wx.showToast({
          title: '错误:' + res.errCode,
        })
      })
    },

    // 设置进度条
    _setTime() {
      duration = backgroundAudioManager.duration;
      // console.log('当前歌曲的时间为：', duration);
      // 将时间进行格式化
      const dataFormat = this._dataFormat(duration);
      this.setData({
        ['showTime.totalTime']: `${dataFormat.min}:${dataFormat.sec}`,
      })
    },
    // 格式化时间方法
    _dataFormat(sec) {
      // 分钟
      const hour = Math.floor(sec / 360);
      const min = Math.floor(sec / 60); //Math.floor向下取整
      sec = Math.floor(sec % 60);
      return {
        'min': this._parse0(min),
        'sec': this._parse0(sec)
      }
    },
    // 补零方法
    _parse0(sec) {
      return sec < 10 ? '0' + sec : sec;
    }
  }
})