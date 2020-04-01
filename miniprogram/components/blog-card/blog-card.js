import formatTime from '../../tools/formatTime.js'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blog: Object
  },
  observers: {
    ['blog.createTime'](val) {
      if (val) {
        // console.log(val)
        this.setData({
          _createTime: formatTime(new Date(val))
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _createTime: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 预览图片
    onPriviewImg(event) {
      const { img, imgsrc } = event.target.dataset
      wx.previewImage({
        urls: img,
        current: imgsrc,
      })
    },
  }
})