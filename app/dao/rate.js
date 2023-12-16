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
  static async update({id, name, value, userid}) {
    const rate = await Rate.findByPk(id)
    if (!rate) {
      throw new global.errs.NotFound('没有找到相关评价信息')
    }
    if (rate.user_id !== userid) {
      throw new global.errs.Error('当前用户没有修改权限')
    }

    if (rate[name]) {
      rate[name] = value
      try {
        const res = await rate.save()
        return [null, res]
      } catch (err) {
        return [err, null]
      }
    }
    return [null, rate]
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

      const rate = await Rate.scope('bh').findAndCountAll({
        where: finner,
        // 每页10条
        limit: page_size,
        offset: (page - 1) * page_size,
        order: [['updated_at', 'DESC']],
      })

      let rows = rate.rows
      const data = {
        data: rows,
        // 分页
        meta: {
          current_page: parseInt(page),
          per_page: 10,
          count: rate.count,
          total: rate.count,
          total_pages: Math.ceil(rate.count / 10),
        },
      }
      return [null, data]
    } catch (err) {
      console.log(err)
      return [err, null]
    }
  }
}

module.exports = {
  RateDao,
}
