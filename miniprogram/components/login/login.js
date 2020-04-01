// components/login/login.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modalShow: Boolean,
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGotUserInfo(event) {
      console.log(event.detail.userInfo);
      // 如果userInfo不为空
      if(event.detail.userInfo){
        this.setData({
          modalShow: false,
        })
        this.triggerEvent('loginSuccess', event.detail.userInfo);
      }else{
        this.triggerEvent('loginFail');
      }
    }
  }
})