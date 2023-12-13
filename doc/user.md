## 接口前缀

```shell
http://localhost:5000/api/v1
```

# 用户

## 用户注册

> 部署线上建议屏蔽掉此注册接口

```
POST    /user/register
```

### 参数说明

| 参数      | 说明     | 是否必填 |
| --------- | -------- | :------: |
| username  | 昵称     |    是    |
| email     | 邮箱     |    是    |
| password  | 密码     |    是    |
| password2 | 确认密码 |    是    |

### 成功操作返回

```json
{
  "msg": "success",
  "code": 200,
  "errorCode": 0,
  "data": {
    "email": "test@163.com",
    "id": 3,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjMsInNjb3BlIjo4LCJpYXQiOjE3MDI0NTMxNjEsImV4cCI6MTcwMjQ1Njc2MX0.6_Gm9DoX6uOm0TdpwHiB9EMnfnOddroIEA1zsTzFGws",
    "username": "test"
  }
}
```
