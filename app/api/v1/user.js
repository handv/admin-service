/**
 * @description 用户的路由 API 接口
 * @author handw
 */

const Router = require('koa-router')
const {RegisterValidator, UserLoginValidator} = require('@validators/user')
const {UserDao} = require('@dao/user')
const {Auth} = require('@middlewares/auth')
const {LoginManager} = require('@service/login')
const {Resolve} = require('@lib/helper')
const res = new Resolve()

const AUTH_USER = 8

const router = new Router({
  prefix: '/api/v1/user',
})

// 用户注册
router.post('/register', async (ctx) => {
  // 通过验证器校验参数是否通过
  const v = await new RegisterValidator().validate(ctx)
  const email = v.get('body.email')
  const password = v.get('body.password2')

  // 创建用户
  const [err, data] = await UserDao.create({
    password,
    email,
    username: v.get('body.username'),
  })

  if (!err) {
    const [errToken, token, id] = await LoginManager.userLogin({
      email,
      password,
    })
    if (!errToken) {
      data.token = token
      data.id = id
    }
    // 返回结果
    ctx.response.status = 200
    ctx.body = res.json(data)
  } else {
    ctx.body = res.fail(err)
  }
})

// 管理登录
router.post('/login', async (ctx) => {
  const v = await new UserLoginValidator().validate(ctx)

  let [err, token, id] = await LoginManager.userLogin({
    email: v.get('body.email'),
    password: v.get('body.password'),
  })
  if (!err) {
    let [err, data] = await UserDao.detail(id)
    if (!err) {
      data.setDataValue('token', token)
      ctx.response.status = 200
      ctx.body = res.json(data)
    }
  } else {
    ctx.body = res.fail(err, err.msg)
  }
})

// 获取用户信息
router.get('/auth', new Auth(AUTH_USER).m, async (ctx) => {
  // 获取用户ID
  const id = ctx.auth.uid

  // 查询用户信息
  let [err, data] = await UserDao.detail(id)
  if (!err) {
    ctx.response.status = 200
    ctx.body = res.json(data)
  } else {
    ctx.response.status = 401
    ctx.body = res.fail(err, err.msg)
  }
})

// 查询非当前用户的用户列表
router.get('/list', new Auth(AUTH_USER).m, async (ctx) => {
  // ctx.auth.uid指发请求的登录用户的id
  let [err, data] = await UserDao.list(ctx.auth.uid)
  if (!err) {
    ctx.response.status = 200
    ctx.body = res.json(data)
  } else {
    ctx.body = res.fail(err)
  }
})

module.exports = router
