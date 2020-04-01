// components/lyric/lyric.js
let lyricHeight = 0;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLyricShow: {
      type: Boolean,
      value: false,
    },
    lyric: String,
  },

  // 组件属性和数据字段监听器
  observers: {
    lyric(lrc) {
      if (lrc == "暂无歌词") {
        console.log(lrc);
        this.setData({
          lrcList: [{
            lrc,
            time: 0,
          }],
          nowLyricIndex: -1,
        })
      } else {
        this._parseLyric(lrc);
      }
      // console.log('传递过来的歌词参数：',lrc);
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    lrcList: [],
    nowLyricIndex: 0, //选中歌词的索引
    scrollTop: 0, // 滚动条滚动的高度
  },


  lifetimes: {
    ready() {
      // 小程序规定每一部手机的宽都为750rpx;
      wx.getSystemInfo({
        success: function(res) {
          console.log('请求设备信息:',res);
          // 求出对应一行歌词所对应的rpx的大小
          lyricHeight = parseInt(res.screenWidth / 750 * 64)
          // console.log(lyricHeight);
        },
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 父节点传递过来的获取currentTime方法
    update(currentTime) {
      // console.log('歌词组件获取的currentTime', currentTime);
      let lrcList = this.data.lrcList;
      // console.log(lrcList);  
      if (lrcList.length === 0) {
        return
      }
      // 为了处理歌曲后面有一大段空白区域，而滑动后歌词未进行滚动
      if (currentTime > lrcList[lrcList.length - 1].time) {
        if (this.data.nowLyricIndex != -1) {
          this.setData({
            nowLyricIndex: -1,
            scrollTop: lrcList.length * lyricHeight,
          })
        }
      }
      for (let i = 0; i < lrcList.length; i++) {
        if (currentTime <= lrcList[i].time) {
          this.setData({
            nowLyricIndex: i - 1, // 行数
            scrollTop: (i - 1) * lyricHeight,
          })
          break;
        }
        // console.log('currentTime:', currentTime);
        // console.log('lrcList[i].time', lrcList[i].time);
      }
    },
    _parseLyric(sLyric) {
      // 将（含时间）歌词存入数组
      let line = sLyric.split('\n');
      // console.log(line);
      let _lrcList = [];
      line.forEach((elem) => {
        let time = elem.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g);
        // console.log('time:',time);
        if (time != null) {
          // 获取歌词（不含时间）
          let lrc = elem.split(time)[1];
          // console.log(lrc);
          // 分解时间
          let timeReg = time[0].match(/(\d{2,3}):(\d{2})(?:\.(\d{2,3}))?/);
          // console.log('timeReg',timeReg);
          // 时间转换为秒
          let timeToSec = parseInt(timeReg[1]) * 60 + parseInt(timeReg[2]) + parseInt(timeReg[3]) / 1000;

          _lrcList.push({
            lrc,
            time: timeToSec,
          });
        }
      });
      this.setData({
        lrcList: _lrcList,
      })
    }
  }
})