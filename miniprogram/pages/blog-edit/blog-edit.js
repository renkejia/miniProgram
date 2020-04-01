// import debounce from '../../tools/debounce.js
// 最大上传照片数
const MAX_IMAGE = 9;
// 最大输入长度
const MAX_WORDNUM = 140;
// 输入文字内容
let content = '';
// 用户信息
let userInfo = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 当前输入字数
    wordLimitNum: 0,
    footerBottom: 0,
    image: [],
    // 是否还能继续添加图片
    selectPhoto: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('blog页面传递的用户信息', options);
    userInfo = options;
  },

  onInput(event) {
    // console.log(event);
    let wordNum = event.detail.value.length;
    if (wordNum >= MAX_WORDNUM) {
      wordNum = `最大字数为${MAX_WORDNUM}`
    }
    this.setData({
      wordLimitNum: wordNum,
    });
    content = event.detail.value;
  },
  // 文本框光标聚焦
  onFocus(event) {
    // 获取键盘高度
    // console.log(event.detail.height);
    this.setData({
      footerBottom: event.detail.height,
    })
  },
  // 文本框失去焦点
  onBlur() {
    this.setData({
      footerBottom: 0,
    })
  },

  chooseImg() {
    let max = MAX_IMAGE - this.data.image.length;
    wx.chooseImage({
      count: MAX_IMAGE,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log(res);
        this.setData({
          image: this.data.image.concat(res.tempFilePaths),
        });
        if (this.data.image.length >= MAX_IMAGE) {
          this.setData({
            selectPhoto: false,
          })
        }
      },
    })
  },
  deletImg(event) {
    // console.log(event);
    // 当前点击的图片索引
    let index = event.target.dataset.index;
    this.data.image.splice(index, 1);
    this.setData({
      image: this.data.image,
    });
    if (this.data.image.length == MAX_IMAGE - 1) {
      this.setData({
        selectPhoto: true,
      })
    }
  },
  // 预览图片
  onPriviewImg(event) {
    wx.previewImage({
      urls: this.data.image,
      current: event.target.dataset.imgsrc,
    })
  },
  // 发布函数

  send() {
      wx.showLoading({
        title: '发布中'
      })
      // 2、数据 -> 云数据库
      // 数据库  文字内容 图片fileID 用户信息openid(用户的唯一标识)（昵称 头像）
      // 1、图片 -> 云存储(免费为5G) fileID 云文件ID
      // 保存上传到云存储的异步任务
      let promiseArr = [];
      // 保存fileId的数据结构
      let fileIds = [];
      for (let i = 0; i < this.data.image.length; i++) {
        let p = new Promise((resolve, reject) => {
          let item = this.data.image[i];
          // 文件扩展名
          let suffix = /\.\w+$/.exec(item)[0];
          // 定义顺序
          let num = 0
          // 1. 图片 -> 云存储
          wx.cloud.uploadFile({
            cloudPath: `blog/${num}-${Date.now()}-${Math.random() * 10000}${suffix}`,
            filePath: item,
            success: (res) => {
              console.log(res.fileID);
              fileIds = fileIds.concat(res.fileID);
              num++;
              resolve();
            },
            fail: (err) => {
              console.error(err);
              reject();
            }
          })
        })
        promiseArr.push(p);
      }
      // 2.存入云数据库
      Promise.all(promiseArr).then(() => {
        wx.cloud.database().collection('blog').add({
          data: {
            ...userInfo,
            content,
            img: fileIds,
            createTime: wx.cloud.database().serverDate(), // 服务端时间
          }
        }).then((res) => {
          wx.hideLoading()
          wx.showToast({
            title: '发布成功',
          }).catch((err) => {
            wx.hideLoading();
            wx.showToast({
              title: '发布失败',
            })
          })
        });
        // 发布成功后跳回blog界面，并刷新界面
        wx.navigateBack();
        const pages = getCurrentPages();
        // console.log(pages);
        // 取到上一个界面
        const prevPage = pages[pages.length - 2];
        // 调用父页面的下拉刷新
        prevPage.onPullDownRefresh();
      });
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
// 防抖
function debounce(fun, delay = 600) {
  let timer = null;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fun.apply(this, arguments);
    }, delay);
  }
};
