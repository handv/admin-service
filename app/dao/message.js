const {Message} = require('@models/message')
const {Feedback} = require('@models/feedback')
const {MessageShare} = require('@models/message_share')
const {sequelize} = require('@core/db')
const {Op} = require('sequelize')
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

      // 创建 MessageShare 记录
      const shareUsers = JSON.parse(v.get('body.share_users')) || []
      const messageShares = shareUsers.map((shareUser) => ({
        message_id: res.id,
        share_user_id: shareUser,
      }))

      await MessageShare.bulkCreate(messageShares)
      return [null, res]
    } catch (err) {
      console.log(err)
      return [err, null]
    }
  }

  // 获取分享给当前用户的信息列表
  static async sharelist(params) {
    const {userid, page_size = 20, page = 1, keyword = ''} = params

    try {
      // 从 message_share 表中获取 message_id
      const messageShare = await MessageShare.findAll({
        where: {
          share_user_id: userid,
        },
        attributes: ['message_id'],
      })

      // 提取 message_id 列表
      const messageIds = messageShare.map((item) => item.message_id)

      // 构建查询条件
      let whereCondition = {
        id: {
          [Op.in]: messageIds,
        },
      }

      if (keyword) {
        whereCondition[Op.or] = [
          {ip: {[Op.like]: '%' + keyword + '%'}},
          {md5: {[Op.like]: '%' + keyword + '%'}},
          {domain: {[Op.like]: '%' + keyword + '%'}},
        ]
      }

      // 在 Message 表中查询
      const message = await Message.scope('msg').findAndCountAll({
        limit: page_size,
        offset: (page - 1) * page_size,
        order: [['created_at', 'DESC']],
        where: whereCondition,
      })

      const data = {
        data: message.rows,
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

  // 获取所有用户发布的信息列表
  static async allList(params = {}) {
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
        raw: true,
      })
      return [null, data]
    } catch (err) {
      return [err, null]
    }
  }

  static async feedbacklist(params) {
    const {userid, page_size = 20, page = 1, keyword = ''} = params

    try {
      // 获取分享了的 message_id
      const sharedMessages = await MessageShare.findAll({
        where: {share_user_id: userid},
        attributes: ['message_id'],
      })

      // 提取 message_id 列表
      const messageIds = sharedMessages.map((msg) => msg.message_id)

      // 构建查询条件
      const whereCondition = {}

      if (keyword) {
        whereCondition[Op.or] = [
          {ip: {[Op.like]: `%${keyword}%`}},
          {domain: {[Op.like]: `%${keyword}%`}},
          {md5: {[Op.like]: `%${keyword}%`}},
        ]
      }

      // 查询满足条件的 feedback
      const feedback = await Feedback.scope('fb').findAndCountAll({
        where: {message_id: {[Op.in]: messageIds}},
        include: [
          {
            model: Message,
            where: whereCondition,
            attributes: ['user_id', 'title'],
          },
        ],
        limit: page_size,
        offset: (page - 1) * page_size,
        order: [['updated_at', 'DESC']],
      })

      const data = {
        data: feedback.rows,
        meta: {
          current_page: parseInt(page),
          per_page: page_size,
          count: feedback.count,
          total: feedback.count,
          total_pages: Math.ceil(feedback.count / page_size),
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
