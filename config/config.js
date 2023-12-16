module.exports = {
  environment: 'dev',
  database: {
    dbName: 'admin',
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'admin123'
  },
  security: {
    secretKey: "secretKey",
    // 过期时间 1小时
    expiresIn: 60 * 60
  }
}
