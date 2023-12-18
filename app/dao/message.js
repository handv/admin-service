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

    let whereCondition = {
      [Op.and]: [
        sequelize.where(
          sequelize.fn(
            'JSON_CONTAINS',
            sequelize.col('share_users'),
            JSON.stringify(userid)
          ),
          true
        ),
      ],
    }

    if (keyword) {
      whereCondition[Op.and].push({
        [Op.or]: [
          {ip: {[Op.like]: '%' + keyword + '%'}},
          {md5: {[Op.like]: '%' + keyword + '%'}},
          {domain: {[Op.like]: '%' + keyword + '%'}},
        ],
      })
    }

    try {
      const message = await Message.scope('msg').findAndCountAll({
        limit: page_size, //每页10条
        offset: (page - 1) * page_size,
        order: [['created_at', 'DESC']],
        where: whereCondition,
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

  // 获取所有用户发布的信息列表
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
        raw: true,
      })
      return [null, data]
    } catch (err) {
      return [err, null]
    }
  }

  static async feedbacklist(params) {
    const {userid, page_size = 20, page = 1, key} = params

    try {
      // 分享给当前用户的信息列表
      const message = await MessageShare.findAndCountAll({
        limit: page_size,
        offset: (page - 1) * page_size,
        order: [['created_at', 'DESC']],
        where: {
          share_user_id: userid,
        },
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
      // // 查询具有特定 message_id 并包含 user_id 的 Feedback 数据
      // const feedbackDataList = await Feedback.findAll({
      //   where: {
      //     message_id: messageDataList.map((message) => message.id), // 使用上一步查询到的 messageDataList 的 id 列表
      //     user_id: {
      //       [Op.ne]: userid, // 添加这个条件来过滤掉 user_id 等于 userid 的数据
      //     },
      //   },
      //   include: [
      //     {
      //       model: Message, // 包含 Message 模型
      //       attributes: ['user_id'], // 仅包含 user_id 字段
      //     },
      //   ],
      // })

      // // 过滤数据
      // const filteredMessageDataList = messageDataList.filter((message) =>
      //   key ? message.user_id === +key : true
      // )
      // const filteredFeedbackDataList = feedbackDataList.filter((feedback) =>
      //   key
      //     ? feedback.user_id === +key || feedback.message.user_id === +key
      //     : true
      // )

      // // 处理需要下发的数据参数
      // const data = {
      //   share: filteredMessageDataList.map(({id, user_id, updated_at}) => ({
      //     id,
      //     user_id,
      //     updated_at,
      //   })),
      //   feedback: filteredFeedbackDataList.map(
      //     ({id, user_id, updated_at, message_id, message}) => ({
      //       id,
      //       user_id,
      //       updated_at,
      //       author_id: message.user_id,
      //       message_id,
      //     })
      //   ),
      // }

      return [null, data]
    } catch (err) {
      return [err, null]
    }
  }
}

module.exports = {
  MessageDao,
}
