const Router = require('koa-router')

const {RateDao} = require('@dao/rate')
const {MessageDao} = require('@dao/message')
const {FeedbackDao} = require('@dao/feedback')

const {Auth} = require('@middlewares/auth')

const {Resolve} = require('@lib/helper')
const res = new Resolve()

const router = new Router({
  prefix: '/api/v1',
})

router.get('/rank', new Auth(Auth.USER).m, async (ctx) => {
  try {
    const [[err1, messageData], [err2, feedbackData], [err3, rateData]] =
      await Promise.all([
        MessageDao.count(),
        FeedbackDao.count(),
        RateDao.count(),
      ])
    const data = {}
    messageData.forEach((item) => {
      const {user_id, count} = item
      if (!data[user_id]) {
        data[user_id] = {}
      }
      data[user_id].message = count
    })
    feedbackData.forEach((item) => {
      const {user_id, count} = item
      if (!data[user_id]) {
        data[user_id] = {}
      }
      data[user_id].feedback = count
    })
    rateData.forEach((item) => {
      const {user_id, score} = item
      if (!data[user_id]) {
        data[user_id] = {}
      }
      data[user_id].rate = +score
    })

    ctx.response.status = 200
    ctx.body = res.json(data)
  } catch (err) {
    ctx.body = res.fail(err)
  }
})
module.exports = router
