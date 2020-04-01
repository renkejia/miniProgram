// components/search/search.js
let keyword = '';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder: {
      type: String,
      value: '请输入关键字'
    }
  },
  externalClasses: [
    'iconfont',
    'icon-sousuo'
  ],
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onInput(event) {
      keyword = event.detail.value;
      let time = null;
      if (time) {
        clearTimeout(time);
      }
      time = setTimeout(() => {
        this.triggerEvent = this.triggerEvent.bind(this);
        this.triggerEvent('onchange', {
          keyword
        })
      }, 400);
    },

    onSearch() {
      // console.log(keyword)
      // blog
      this.triggerEvent('search', {
        keyword
      })
    },
  }
})