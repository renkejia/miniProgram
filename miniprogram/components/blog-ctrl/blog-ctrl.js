// components/blog-ctrl/blog-ctrl.js
let userInfo = {};
const db = wx.cloud.database();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogid: String,
    blog: Object,
  },
  externalClasses: ['iconfont', 'iconpinglun', 'iconfenxiang'],
  /**
   * 组件的初始数据
   */
  data: {
    // 登录组件是否显示
    loginShow: false,
    // 底部弹出层是否显示
    showModal: false,
    content: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComment() {
      // 判断用户是否授权
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: (res) => {
                userInfo = res.userInfo
                // 显示评论的弹出层
                this.setData({
                  showModal: true,
                })
              },
            })
          } else {
            this.setData({
              loginShow: true
            })
          }
        },
      })
    },

    onLoginsuccess(event) {
      userInfo = event.detail;
      // 授权框消失，评论显示
      this.setData({
        loginShow: false,
      }, () => {
        this.setData({
          showModal: true,
        })
      })
    },
    onLoginfail() {
      wx.showModal({
        title: '授权用户才能进行评价',
      })
    },

    onInput(event) {
      this.setData({
        content: event.detail.value
      })
    },
    // 发表评论
    onSend(event) {
      // console.log(event);
      // let blogId = this.properties.blogId;
      console.log()
      let content = this.data.content;
      if (content.trim() == '') {
        wx.showModal({
          title: '评论的内容不能为空',
        })
        return
      }
      const templateId = 'GH9ZonEeNdjhq6BfBnNC43BRErsmyRGFeV43-6BUphc';
      wx.requestSubscribeMessage({
        tmplIds: [templateId],
        success: (res) => {
          console.log(res);
          if (res[templateId] == 'accept') {
            //用户同意了订阅，允许订阅消息    
            wx.showToast({
              title: '订阅成功'
            })
          } else {
            //用户拒绝了订阅，禁用订阅消息    
            wx.showToast({
              title: '订阅失败'
            })
          }
          // 调用云函数
          wx.cloud.callFunction({
            name: 'sendMessage',
            data: {
              content,
              blogId: this.properties.blogid,
              nickname: userInfo.nickName,
            }
          }).then((res) => {
            console.log('请求send云函数', res);
          })
          wx.showLoading({
            title: '评价中',
            mask: true,
          })
          // 插入云数据库
          db.collection('blog-comment').add({
            data: {
              content,
              blogId: this.properties.blogid,
              createTime: db.serverDate(),
              nickName: userInfo.nickName,
              avatarUrl: userInfo.avatarUrl
            }
          }).then((res) => {
            wx.hideLoading();
            wx.showToast({
              title: '评论成功',
            })
            this.setData({
              showModal: false,
              content: '',
            })
            // 父元素刷新评论页面
            this.triggerEvent('refreshCommentList')

          })
        },
        fail(err) {
          console.error(err)
        }
      })
    }
  },
})
