const Router = require('koa-router')

const {MessageValidator} = require('@validators/message')

const {Auth} = require('@middlewares/auth')
const {MessageDao} = require('@dao/message')
const {LabelsDao} = require('@dao/labels')

const {Resolve} = require('@lib/helper')
const res = new Resolve()

// todo：改到constants里
const AUTH_USER = 8

const router = new Router({
  prefix: '/api/v1',
})

/**
 * 发布信息
 */
router.post('/message', new Auth(AUTH_USER).m, async (ctx) => {
  // 通过验证器校验参数是否通过
  const v = await new MessageValidator().validate(ctx)
  // 更新labels
  const lables = v.get('body.labels')
  const [labelErr] = await LabelsDao.update(lables)
  const [err, data] = await MessageDao.create(v, ctx.auth.uid)
  if (!err) {
    // 返回结果
    ctx.response.status = 200
    ctx.body = res.success('发布成功')
  } else {
    ctx.body = res.fail(err)
  }
})

/**
 * 获取分享给当前用户的信息列表
 */
router.get('/message/sharelist', new Auth(AUTH_USER).m, async (ctx) => {
  // 当前登录用户
  const [err, data] = await MessageDao.sharelist({userid: ctx.auth.uid})
  if (!err) {
    ctx.response.status = 200
    ctx.body = res.json(data)
  } else {
    ctx.body = res.fail(err)
  }
})

/**
 * 获取当前用户发布的信息
 */
router.get('/message/mine', new Auth(AUTH_USER).m, async (ctx) => {
  // 当前登录用户
  const [err, data] = await MessageDao.minelist({userid: ctx.auth.uid})
  if (!err) {
    ctx.response.status = 200
    ctx.body = res.json(data)
  } else {
    ctx.body = res.fail(err)
  }
})

module.exports = router
