const {Message} = require('@models/message')
const {Feedback} = require('@models/feedback')
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

  // 获取当前用户发布的信息列表
  static async minelist(params) {
    const {userid, page_size = 20, page = 1} = params

    try {
      const message = await Message.scope('iv').findAndCountAll({
        limit: page_size, //每页10条
        offset: (page - 1) * page_size,
        order: [['created_at', 'DESC']],
        where: {
          user_id: userid,
        },
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

  // 获取所有用户发布的信息列表（需要管理员权限）
  static async alllist(params = {}) {
    const {page_size = 20, page = 1} = params

    try {
      const message = await Message.scope('iv').findAndCountAll({
        limit: page_size, //每页10条
        offset: (page - 1) * page_size,
        order: [['created_at', 'DESC']],
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

  // 统计每个用户发布的信息数量
  static async count() {
    try {
      const data = await Message.findAll({
        group: ['user_id'],
        attributes: [
          'user_id', // 选择要分组的字段
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'], // 使用 COUNT 聚合函数统计 message 个数
        ],
        order: [['user_id']],
        raw: true
      })
      return [null, data]
    } catch (err) {
      return [err, null]
    }
  }

  static async steamlist(params) {
    const {userid, page_size = 20, page = 1} = params

    try {
      // 分享给当前用户的信息列表
      const messageDataList = await Message.scope('iv').findAll({
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
        attributes: [
          'id',
          'md5',
          'domain',
          'ip',
          'user_id',
          'share_users',
          'updated_at',
        ],
        raw: true,
      })

      // 查询具有特定 message_id 并包含 user_id 的 Feedback 数据
      const feedbackDataList = await Feedback.findAll({
        where: {
          message_id: messageDataList.map((message) => message.id), // 使用上一步查询到的 messageDataList 的 id 列表
        },
        include: [
          {
            model: Message, // 包含 Message 模型
            attributes: ['user_id'], // 仅包含 user_id 字段
          },
        ],
      })

      // 处理需要下发的数据参数
      const data = {
        share: messageDataList.map(({id, user_id, updated_at}) => ({
          id,
          user_id,
          updated_at,
        })),
        feedback: feedbackDataList.map(
          ({id, user_id, updated_at, message}) => ({
            id,
            user_id,
            updated_at,
            author_id: message.user_id,
          })
        ),
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
