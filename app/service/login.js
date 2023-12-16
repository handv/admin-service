const {UserDao} = require('@dao/user')
const {generateToken} = require('@core/util')
const {Auth} = require('@middlewares/auth')

class LoginManager {
  // 用户登录
  static async userLogin(params) {
    const {email, password} = params
    // 验证账号密码是否正确
    const [err, user] = await UserDao.verify(email, password)
    if (!err) {
      return [null, generateToken(user.id, user.status), user.id]
    } else {
      return [err, null]
    }
  }
}

module.exports = {
  LoginManager,
}
