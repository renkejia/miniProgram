// pages/blog-detail/blog-detail.js
import formatTime from '../../tools/formatTime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blog: {},
    commentList: [],
    blogId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('博客页传递的当前blogid', options);
    this.setData({
      blogId: options.blogid
    })
    this._getBlogDetail(options.blogid);
  },
  // 获取数据
  _getBlogDetail(blogid) {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        blogid: this.data.blogId,
        $url: 'detail',
      }
    }).then((res) => {

      let commentList = res.result.commentList.data;
      for (let i = 0; i < commentList.length; i++) {
        commentList[i].createTime = formatTime(new Date(commentList[i].createTime))
      }

      this.setData({
        commentList,
        blog: res.result.detail[0],
      })

      wx.hideLoading();
      console.log('向云函数请求的评论的数据', res);
    })

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
  onShareAppMessage: function (event) {
    const blog = this.data.blog;
    return {
      title: blog.content,
      path: `/pages/blog-detail/blog-detail?blogId=${blog._id}`
    }
  }
})