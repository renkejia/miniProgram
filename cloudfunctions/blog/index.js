// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const TcbRouter = require('tcb-router')

const db = cloud.database();

const MAX_LIMIT = 100;

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })

  app.router('list', async (ctx, next) => {
    const keyword = event.keyword;
    // 存放查询规则的数组
    let reg = {};
    if (keyword.trim() != '') {
      reg = {
        content: db.RegExp({
          regexp: keyword,
          options: 'i'
        })
      }
    }
    // where为查询条件
    ctx.body = await db.collection('blog').where(reg).skip(event.start).limit(event.count)
      .orderBy('createTime', 'desc').get().then((res) => {
        return res.data
      })
  });

  app.router('detail', async (ctx, next) => {
    let blogId = event.blogid;
    // 详情查询
    let detail = await db.collection('blog').where({
      _id: blogId
    }).get().then((res) => {
      return res.data
    })
    // 评论查询
    const countResult = await db.collection('blog').count();
    const total = countResult.total;
    // 存储评论列表的容器
    let commentList = {
      data: []
    }
    if (total > 0) {
      const batchCount = Math.ceil(total / MAX_LIMIT);
      const tasks = [];
      for (let i = 0; i < batchCount; i++) {
        let promise = db.collection('blog-comment').skip(i * MAX_LIMIT)
          .limit(MAX_LIMIT).where({
            blogId
          }).orderBy('createTime', 'desc').get()
        tasks.push(promise);
      }
      if (tasks.length > 0) {
        // reduce是累加器
        commentList = (await Promise.all(tasks)).reduce((acc, cur) => {
          return {
            data: acc.data.concat(cur.data)
          }
        })
      }
    }
    ctx.body = {
      commentList,
      detail,
    }
  });

  const wxContext = cloud.getWXContext()
  app.router('getListByOpenid',async(ctx,next)=>{
    ctx.body = await db.collection('blog').where({
      _openid: wxContext.OPENID,
    }).skip(event.start).limit(event.count)
    .orderBy('createTime','desc').get().then((res)=>{
      return res.data
    })
  })

  return app.serve()
}