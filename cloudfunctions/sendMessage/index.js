const cloud = require('wx-server-sdk')
cloud.init()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    //templateId 订阅消息模块id
    const templateId = 'GH9ZonEeNdjhq6BfBnNC43BRErsmyRGFeV43-6BUphc'
    const wxContext = cloud.getWXContext()
    const result = await cloud.openapi.subscribeMessage.send({
      touser: wxContext.OPENID,
      page: `/pages/blog-detail/blog-detail?blogId=${event.blogId}`,//查看的页面
      data: {
        thing1: {
          value: event.nickname,
        },
        thing2: {
          value: event.content,
        },
      },
      templateId: templateId,
      miniprogramState: 'developer'
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}
