/**
 * @description 标签的路由 API 接口
 * @description Labels's routing API interface
 * @author handw
 */

const Router = require('koa-router');

const { LabelsDao } = require('@dao/labels');
const { Auth } = require('@middlewares/auth');

const { Resolve } = require('@lib/helper');
const res = new Resolve();

const router = new Router({
  prefix: '/api/v1'
})

/**
 * 获取所有的分类
 */
router.get('/labels', new Auth(Auth.USER).m, async (ctx) => {
  const [err, data] = await LabelsDao.detail(ctx.query)
  if (!err) {
    // 返回结果
    ctx.response.status = 200
    ctx.body = res.json(data)
  } else {
    ctx.body = res.fail(err)
  }
})

// todo:测试接口，上线删掉
router.get('/test', async (ctx) => {
  const [err, data] = await LabelsDao.detail(ctx.query)
  if (!err) {
    // 返回结果
    ctx.response.status = 200
    ctx.body = res.json(data)
  } else {
    ctx.body = res.fail(err)
  }
})

module.exports = router
