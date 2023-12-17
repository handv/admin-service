## 一、项目介绍

这个项目就是完成一个完整的后台管理项目，包含服务端接口 API，管理后台，以及部署上线流程。为了项目更好的区分，这个项目主要介绍使用 Node.js Koa2 框架开发一套完整的服务端接口 API 项目，另外的项目请点击以下：

- 基于 React.js + Ant Design 实现的博客管理后台：[admin-front](https://github.com/handv/admin-front.git)

### 1.1.项目模块

使用精小而强大的 Node.js Koa2 框架做服务端 API 接口，非常适合想用 Node.js Koa2 做服务的朋友，相信你一定能学到知识。

- 管理员模块
  - 实现权限管理，能够对其他模块进行增删改查权限
  - 登录注册模块，登录管理后台
- 信息模块
  - 实现新增，修改，删除，查询
- 反馈模块
  - 实现反馈的新增，修改，删除，查询
  - 实现反馈与信息进行关联

### 1.2.接口文档

记录和完善接口文档是一个良好的习惯，接口文档放在 doc 目录下。

### 1.3.项目展示

## 二、使用项目

### 2.1.克隆项目

首先使克隆项目，然后进入项目根目录使用命令安装包，最后命令启动项目，代码会根据模型自动创建数据库表的。

```
# 克隆项目代码

git clone https://github.com/handv/admin-service
```

### 2.2.项目架构

拉取代码下来后，简单说明一下项目架构，我们简单熟悉一下，目的是为了了解清楚每个文件夹有什么作用的，好的代码结构并不仅仅是为了看上去清晰，它更像是我们对一个系统的拆解和组装。

```iterm2
.
├── _tests 单元测试
├── app *重点, 项目工程入口
    ├── api 接口
    ├── dao 数据存取对象（Data Access Objects）
    ├── lib 工具库
    ├── models 建模，把业务逻辑映射成数据模型
    ├── service 数据处理
    └── validators 数据验证
├── app.js 入口文件
├── config 配置文件
├── core 核心公共工具库
├── doc 接口文档
├── jest.config.js  测试配置文件
├── middlewares 中间件
├── package-lock.json
├── package.json
└── yarn.lock
```

### 2.3.创建数据库

启动项目前一定要在创建好 **admin** 数据库，如果你还没安装上数据库，请点击[MySQL 下载](https://dev.mysql.com/downloads/mysql/)，请在根目录下的 |——config/config.js 文件下修改您本地的数据库名字（**admin**）和数据库密码 ( **password** )。以下是执行数据库命令：

```
# 登录数据库

mysql -uroot -p (回车然后输入你的本机数据库密码)

# 创建 admin 数据库（如果要改数据库名，改下面👇命令里的admin）

CREATE DATABASE IF NOT EXISTS admin DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2.4.启动项目

以下是启动服务端项目的操作命令：

```
# 进入项目根目录

cd admin-service

# 安装依赖包

npm run install 或者 yarn install

# 启动 Node.js Koa2 项目

npm run dev 或者 yarn dev

# 如果要在服务器上启动项目，可以安装pm2

npm run startup 或者 yarn startup

```

API 端口默认是 `5000`，打开浏览器输入回车：`http://localhost:5000` 可以看到浏览器返回数据，可以查看目录下的 ./app/api/v1 下的接口或者看 doc 目录下的 markdown 接口文档，在 postman 测试接口。

Postman 下载地址：[https://www.postman.com/downloads/](https://www.postman.com/downloads/)

## 三、FAQ

1. 没有 yarn 环境，npm 可以吗？

   > 答：可以的，建议使用 yarn，yarn 比 npm 速度快，主要是安装版本统一。

2. 启动 Koa2 项目报错，请问原因？
   > 答：首先，请检查一下使用 npm 或 yarn 安装依赖包没。然后，再请检查一下确保安装好数据库，新建好数据库：admin，请看上面的数据库配置。最后看下启动打印日志是否有报错的信息。

## License

[MIT](https://github.com/lfb/nodejs-koa-blog/blob/master/LICENSE)

喜欢或对你有帮助的话，请你点一个星星 <strong style='color:red;'>star</strong> 鼓励我，或者您有更好的建议和意见，请提出来告知我，可以留言。希望能够帮助到你学习！Thanks！共勉！
