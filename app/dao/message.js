const {Message} = require('@models/message')
const {sequelize} = require('@core/db')
// 定义信息模型
class MessageDao {
  // 发布信息
  static async create(v, user_id) {
    const message = new Message()

    message.title = v.get('body.title')
    message.md5 = v.get('body.md5')
    message.ip = v.get('body.ip')
    message.domain = v.get('body.domain')
    message.labels = v.get('body.labels')
    message.share_users = v.get('body.share_users')
    message.user_id = user_id

    try {
      const res = await message.save()
      return [null, res]
    } catch (err) {
      console.log(err)
      return [err, null]
    }
  }

  // 获取分享给当前用户的信息列表
  static async sharelist(params) {
    const {userid, page_size = 20, page = 1} = params

    try {
      const message = await Message.scope('iv').findAndCountAll({
        limit: page_size, //每页10条
        offset: (page - 1) * page_size,
        order: [['created_at', 'DESC']],
        where: sequelize.where(
          sequelize.fn(
            'JSON_CONTAINS',
            sequelize.col('share_users'),
            JSON.stringify(userid)
          ),
          true
        ),
        attributes: ['id', 'md5', 'domain', 'ip', 'user_id', 'share_users'],
      })

      const data = {
        data: message.rows,
        // 分页
        meta: {
          current_page: parseInt(page),
          per_page: page_size,
          count: message.count,
          total: message.count,
          total_pages: Math.ceil(message.count / page_size),
        },
      }

      return [null, data]
    } catch (err) {
      return [err, null]
    }
  }
}

module.exports = {
  MessageDao,
}
