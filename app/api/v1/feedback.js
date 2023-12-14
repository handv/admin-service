const Router = require('koa-router')

const { FeedbackDao } = require('@dao/feedback')
const { FeedbackValidator, PositiveArticleIdParamsValidator } = require('@validators/feedback')
const { Auth } = require('@middlewares/auth');

const { Resolve } = require('@lib/helper');
const res = new Resolve();

const AUTH_USER = 8;

const router = new Router({
  prefix: '/api/v1'
})

// 获取评论详情(根据userid和message_id)
router.get('/feedback/:message_id', new Auth(AUTH_USER).m, async (ctx) => {
  // 通过验证器校验参数是否通过
  const v = await new PositiveArticleIdParamsValidator().validate(ctx);

  // 获取分类ID参数
  const id = v.get('path.message_id')
  const [err, data] = await FeedbackDao.detail({id, userid: ctx.auth.uid})
  // 返回结果
  if (!err) {
    ctx.response.status = 200;
    ctx.body = res.json(data);
  } else {
    ctx.body = res.fail(err);
  }
})

module.exports = router
