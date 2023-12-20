## 响应code

200: 成功，返回反馈详情
401: 未授权，用户需要认证
404: 未找到，没有找到对应的反馈信息

## 获取反馈详情

```
GET /api/v1/feedback/:message_id
```

### 参数说明

| 参数       | 说明    | 是否必填 |
| ---------- | ------- | :------: |
| message_id | 信息 id |    否    |

### 成功操作返回

```json
{
  "code": 200,
  "errorCode": 0,
  "msg": "success",
  "data": {}
}
```

## 修改反馈

```
PUT /api/v1/feedback/:id
```

### 参数说明

| 参数  | 说明    | 是否必填 |
| ----- | ------- | :------: |
| id    | 反馈 id |    是    |
| name  | 反馈名称 |    是    |
| value | 反馈值  |    是    |

### 成功操作返回

```json
{
  "code": 200,
  "errorCode": 0,
  "msg": "更新评论成功"
}
```



## 获取该分享信息下的其他用户反馈列表

```
GET /api/v1/share/feedbacklist/:id
```

### 参数说明

| 参数 | 说明    | 是否必填 |
| ---- | ------- | :------: |
| id   | 信息id |    是    |

### 成功操作返回

```json
{
  "code": 200,
  "errorCode": 0,
  "msg": "success",
  "data": {}
}
```
