const {Op} = require('sequelize')
const {Feedback} = require('@models/feedback')
const {sequelize} = require('@core/db')

class FeedbackDao {
  // 获取评论详情
  static async detail({id, userid} = {}) {
    const defaultValue = {case1: 0, case2: 0, case3: 0, note: ''}
    try {
      // created表示是否为新建
      let [feedback, created] = await Feedback.findOrCreate({
        where: {
          message_id: id,
          user_id: userid,
          deleted_at: null,
        },
        defaults: {
          fb1: {...defaultValue},
          fb2: {...defaultValue},
          fb3: {...defaultValue},
          massage_id: id,
          user_id: userid,
        },
        attributes: ['id', 'fb1', 'fb2', 'fb3'],
      })
      if (!feedback) {
        throw new global.errs.NotFound('没有找到相关评论信息')
      }

      return [null, feedback]
    } catch (err) {
      return [err, null]
    }
  }

  // 更新反馈
  static async update({id, name, value, userid}) {
    const feedback = await Feedback.findByPk(id)
    if (!feedback) {
      throw new global.errs.NotFound('没有找到相关反馈信息')
    }
    if (feedback.user_id !== userid) {
      throw new global.errs.Error('当前用户没有修改权限')
    }

    if (feedback[name]) {
      feedback[name] = value
      try {
        const res = await feedback.save()
        return [null, res]
      } catch (err) {
        return [err, null]
      }
    }
    return [null, feedback]
  }

  // 当前共享信息的其他用户反馈（除去当前用户）
  static async getList(params = {}) {
    try {
      const {message_id, user_id, page_size = 10, page = 1} = params

      if (!message_id) {
        throw new global.errs.NotFound('必须传入message id')
      }

      const finner = {
        deleted_at: null,
        message_id,
      }

      if (user_id) {
        finner.user_id = {[Op.ne]: user_id}
      }

      const feedback = await Feedback.scope('bh').findAndCountAll({
        where: finner,
        // 每页10条
        limit: page_size,
        offset: (page - 1) * page_size,
        order: [['updated_at', 'DESC']],
      })

      let rows = feedback.rows
      const data = {
        data: rows,
        // 分页
        meta: {
          current_page: parseInt(page),
          per_page: 10,
          count: feedback.count,
          total: feedback.count,
          total_pages: Math.ceil(feedback.count / 10),
        },
      }
      return [null, data]
    } catch (err) {
      console.log(err)
      return [err, null]
    }
  }

  // 统计每个用户反馈的信息数量
  static async count() {
    try {
      const data = await Feedback.findAll({
        where: {
          'updated_at': {
            [Op.ne]: sequelize.col('created_at'), // 添加筛选条件，只筛选用户编辑过的数据
          },
        },
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
}

module.exports = {
  FeedbackDao,
}
