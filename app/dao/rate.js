const {Op} = require('sequelize')
const {Rate} = require('@models/rate')

class RateDao {
  // 获取评论详情
  static async detail({id, userid} = {}) {
    try {
      // created表示是否为新建
      let [rate, created] = await Rate.findOrCreate({
        where: {
          message_id: id,
          user_id: userid,
          deleted_at: null,
        },
        defaults: {
          rate1score: 0,
          rate2score: 0,
          rate3score: 0,
          rate1correct: 0,
          rate2correct: 0,
          rate3correct: 0,
          massage_id: id,
          user_id: userid,
        },
        attributes: [
          'id',
          'rate1score',
          'rate2score',
          'rate3score',
          'rate1correct',
          'rate2correct',
          'rate3correct',
        ],
        raw: true, // 仅返回指定的字段
      })
      if (!rate) {
        throw new global.errs.NotFound('没有找到相关评论信息')
      }

      return [null, rate]
    } catch (err) {
      return [err, null]
    }
  }

  // 更新反馈
  static async update({id, data = {}, userid}) {
    const rate = await Rate.findByPk(id)
    if (!rate) {
      throw new global.errs.NotFound('没有找到相关评价信息')
    }
    if (rate.user_id !== userid) {
      throw new global.errs.Error('当前用户没有修改权限')
    }

    for (let [key, value] of Object.entries(data)) {
      if (key !== 'id') {
        rate[key] = value
      }
    }

    try {
      const res = await rate.save()
      return [null, res]
    } catch (err) {
      return [err, null]
    }
  }
}

module.exports = {
  RateDao,
}
