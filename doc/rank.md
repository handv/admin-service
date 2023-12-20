## 获取用户排名

```http
GET /api/v1/rank
```

### 参数说明

无

### 成功操作返回

```json
{
  "code": 200,
  "data": {
    "user_id": {
      "message": count,
      "feedback": count,
      "rate": score
    },
    ...
  }
}
```

### 响应code

200: 成功，返回用户排名信息
其他: 失败，返回错误信息

这个接口返回一个对象，其中的每个键是用户的 ID，对应的值是一个对象，包含了该用户的信息数量、反馈数量和评分。