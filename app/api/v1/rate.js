const Router = require('koa-router')

const {RateDao} = require('@dao/rate')
const {
  RateValidator,
  PositiveArticleIdParamsValidator,
} = require('@validators/feedback')
const {Auth} = require('@middlewares/auth')

const {Resolve} = require('@lib/helper')
const res = new Resolve()

const router = new Router({
  prefix: '/api/v1',
})

// 获取评论详情(根据userid和message_id)
router.get('/rate/:message_id', new Auth(Auth.USER).m, async (ctx) => {
  // 通过验证器校验参数是否通过
  const v = await new PositiveArticleIdParamsValidator().validate(ctx)

  // 获取分类ID参数
  const id = v.get('path.message_id')
  const [err, data] = await RateDao.detail({id, userid: ctx.auth.uid})
  // 返回结果
  if (!err) {
    ctx.response.status = 200
    ctx.body = res.json(data)
  } else {
    ctx.body = res.fail(err)
  }
})

// 修改反馈
router.put('/rate/:id', new Auth(Auth.USER).m, async (ctx) => {
  // 通过验证器校验参数是否通过
  const v = await new RateValidator().validate(ctx)

  const id = v.get('path.id')
  const name = v.get('body.name')
  const value = v.get('body.value')
  const userid = ctx.auth.uid
  const [err, data] = await RateDao.update({id, name, value, userid})
  if (!err) {
    // 返回结果
    ctx.response.status = 200
    ctx.body = res.success('更新评论成功')
  } else {
    ctx.body = res.fail(err)
  }
})

// 获取该分享信息下的其他用户反馈列表
router.get('/share/ratelist/:id', new Auth(Auth.USER).m, async (ctx) => {
  // 分享信息id
  const {id} = ctx.params
  // 当前用户id
  const user_id = ctx.auth.uid
  const [err, data] = await RateDao.getList({message_id: +id, user_id})
  if (!err) {
    // 返回结果
    ctx.response.status = 200
    ctx.body = res.json(data)
  } else {
    ctx.body = res.fail(err)
  }
})
module.exports = router
