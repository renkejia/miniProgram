// pages/blog/blog.js
// 搜索关键字
// import debounce from '../../tools/debounce.js';

let keyword = '';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 控制底部弹出层是否显示
    modalShow: false,
    blogList: [],
  },

  // 发布功能
  onPublish: debounce(function () {
    wx.getSetting({
      success: (res) => {
        console.log('请求用户数据是否成功', res);
        // 判断用户是否授权
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: (res) => {
              this.onLoginSuccess({
                detail: res.userInfo
              });
            }
          })
        } else {
          this.setData({
            modalShow: true,
          })
        }
      }
    })
  }, 500),
  // 从modal（底部登录）组件传递过来的事件
  onLoginSuccess(event) {
    const {
      nickName,
      avatarUrl
    } = event.detail;
    wx.navigateTo({
      url: `../blog-edit/blog-edit?nickName=${nickName}&avatarUrl=${avatarUrl}`,
    })
  },
  onLoginFail() {
    wx.showModal({
      title: '需登录授权才能发布',
      content: '',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadBlogList()
  },
  // 加载博客数据
  _loadBlogList(start = 0) {
    wx.showLoading({
      title: '拼命加载中...',
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        start,
        count: 10,
        keyword,
        $url: 'list',
      }
    }).then((res) => {
      console.log('从云函数请求blog数据', res)
      this.setData({
        blogList: this.data.blogList.concat(res.result)
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })
  },

  goDetail(event) {
    wx.navigateTo({
      url: `../../pages/blog-detail/blog-detail?blogid=${event.target.dataset.blogid}`,
    })
  },

  onChange(event) {
    // 如果keyword为空
    keyword = event.detail.keyword;
    if (!keyword) {
      this.onSearch(event);
    }
  },

  onSearch(event) {
    // console.log(event);
    keyword = event.detail.keyword;
    // 先将数据清空
    this.setData({
      blogList: []
    })
    // 查询数据
    this._loadBlogList(0);
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
    // 下拉刷新时清空数据
    this.setData({
      blogList: []
    })
    // 重新加载数据
    this._loadBlogList(0);
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._loadBlogList(this.data.blogList.length);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
    console.log(event);
    const blog = event.target.dataset.blog;
    return {
      title : blog.content,
      path: `/pages/blog-detail/blog-detail?blogid=${blog._id}`
    }
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
}