
目录结构

```
music
├── cloudfunctions      // 云开发相关文件
│   ├── blog    // 博客相关函数
│   │   ├── index.js
│   │   ├── node_modules
│   │   ├── package-lock.json
│   │   └── package.json
│   ├── callback
│   │   ├── config.json
│   │   ├── index.js
│   │   └── package.json
│   ├── echo
│   │   ├── config.json
│   │   ├── index.js
│   │   └── package.json
│   ├── getPlaylist     // 歌单获取函数
│   │   ├── config.json
│   │   ├── index.js
│   │   ├── node_modules
│   │   └── package.json
│   ├── getQRcode       // 小程序码获取函数
│   │   ├── config.json
│   │   ├── index.js
│   │   └── package.json
│   ├── login       // 登录信息获取函数
│   │   ├── config.json
│   │   ├── index.js
│   │   ├── node_modules
│   │   ├── package-lock.json
│   │   └── package.json
│   ├── music       // 音乐播放相关函数
│   │   ├── index.js
│   │   ├── node_modules
│   │   └── package.json
│   ├── openapi     
│   │   ├── config.json
│   │   ├── index.js
│   │   └── package.json
│   └── sendMessage     // 订阅消息处理函数
│       ├── config.json
│       ├── index.js
│       └── package.json
├── miniprogram
│   ├── app.js
│   ├── app.json
│   ├── app.wxss
│   ├── components  // 组件
│   │   ├── blog-card       // 博客详情组件
│   │   ├── blog-ctrl       // 博客按钮组件
│   │   ├── bottom-modal    // 底部评论组件
│   │   ├── login       // 登录组件
│   │   ├── lyric       // 歌词组件
│   │   ├── musiclist   // 歌单组件
│   │   ├── playlist    // 歌单列表组件
│   │   ├── progress-bar    // 进度条组件
│   │   └── search  // 搜索组件
│   ├── iconfont.wxss
│   ├── images
│   │   ├── blog-active.png
│   │   ├── blog.png
│   │   ├── music-active.png
│   │   ├── music.png
│   │   ├── profile-active.png
│   │   └── profile.png
│   ├── pages
│   │   ├── blog        // 发现页面
│   │   ├── blog-detail     // 发现详情页
│   │   ├── blog-edit       // 发布博客页面
│   │   ├── musicDesc       // 音乐播放页面
│   │   ├── musiclist       // 歌单详情页
│   │   ├── playlist        // 歌单页
│   │   ├── profile         // 我的页面
│   │   ├── profile-bloghistory     // 我的发现页
│   │   └── profile-playhistory     // 我的播放历史页
│   ├── sitemap.json
│   ├── style
│   │   └── guide.wxss
│   └── tools       // 脚本工具
│       ├── debounce.js     // 防抖
│       ├── formatTime.js   // 格式化时间
│       └── runtime.js      
├── project.config.json
└── README.md   
```

页面目录
```
  "pages": [
    "pages/playlist/playlist",
    "pages/blog/blog",
    "pages/profile/profile",
    "pages/musiclist/musiclist",
    "pages/musicDesc/musicDesc",
    "pages/blog-edit/blog-edit",
    "pages/blog-detail/blog-detail",
    "pages/profile-playhistory/profile-playhistory",
    "pages/profile-bloghistory/profile-bloghistory"
  ],
```
---
项目主要功能截图

  <img src="https://ae01.alicdn.com/kf/Hfe5a39a5d4a54c3ba15bdccbaad7f261A.png" width="200px"/>   
  <img src="https://ae01.alicdn.com/kf/H87580e137e634b7e96f55e22b6418ea9j.png" width="200px"/>
  <img src="https://ae01.alicdn.com/kf/H00ca266fc6834f33b95863471efdeb28X.png" width="200px"/>
  <img src="https://ae01.alicdn.com/kf/Hcfb49a68226b4d1d8cd1275fcc3b1a0bI.png" width="200px"/>
  <img src="https://ae01.alicdn.com/kf/H928e864a240a4d818a6d789ce5c794ebN.png" width="200px"/>
  <img src="https://ae01.alicdn.com/kf/H5ac0de04e5d24470b64c6ea5442dbc5bv.png" width="200px"/>
  <img src="https://ae01.alicdn.com/kf/Ha31edc96e294462a875526f12e79c0723.png" width="200px"/>
  <img src="https://ae01.alicdn.com/kf/H3ff6fff41d504805b2c0515acf7d15413.png" width="200px"/>

---
## 云开发 quickstart

这是云开发的快速启动指引，其中演示了如何上手使用云开发的三大基础能力：

- 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 文档型数据库
- 文件存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码

## 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

