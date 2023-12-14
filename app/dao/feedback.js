const {Feedback} = require('@models/feedback')

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
}

module.exports = {
  FeedbackDao,
}
