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
}

module.exports = {
  FeedbackDao,
}
