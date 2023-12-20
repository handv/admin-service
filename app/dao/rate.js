const {sequelize} = require('@core/db')
const {Rate} = require('@models/rate')
const {Message} = require('@models/message')
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
          ip: {
            score: 0,
            correct: 0,
          },
          domain: {
            score: 0,
            correct: 0,
          },
          md5: {
            score: 0,
            correct: 0,
          },
          message_id: id,
          user_id: userid,
        },
        attributes: ['id', 'ip', 'domain', 'md5'],
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

  // 统计每个用户的得分情况
  static async count() {
    try {
      const data = await sequelize.query(
        "SELECT m.user_id, SUM(JSON_EXTRACT(r.ip, '$.score') + JSON_EXTRACT(r.domain, '$.score') + JSON_EXTRACT(r.md5, '$.score')) AS score FROM message m INNER JOIN rate r ON m.id = r.message_id GROUP BY m.user_id ORDER BY m.user_id",
        {type: sequelize.QueryTypes.SELECT}
      )
      return [null, data]
    } catch (err) {
      return [err, null]
    }
  }
}

module.exports = {
  RateDao,
}
