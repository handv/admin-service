module.exports = {
  apps: [
    {
      name: 'admin-service',
      script: 'app.js', // 指定 Koa 应用的入口文件
      instances: 'max', // 或者指定要启动的实例数量
      exec_mode: 'cluster', // 使用 cluster 模式
      watch: true, // 是否监视文件变化
      ignore_watch: ['node_modules', 'logs'], // 忽略监视的文件夹
      env: {
        NODE_ENV: 'production',
      },
      log: './logs',
    },
  ],
}
