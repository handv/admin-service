## 发布信息

```http
POST /api/v1/message
```

### 参数说明

| 参数 | 说明 | 是否必填 |
| ---- | ---- | -------- |
| labels | 标签 | 是 |
| share_users | 分享用户 | 是 |
| domain | 域名 | 是 |
| ip | ip | 是 |
| md5 | md5 | 是 |
| title | 标题 | 是 |

### 成功操作返回

```json
{
  "code": 200,
  "errorCode": 0,
  "msg": "发布成功"
}
```

### 响应code

200: 成功，返回发布成功信息
其他: 失败，返回错误信息

## 获取分享给当前用户的信息列表

```http
GET /api/v1/message/sharelist
```

### 参数说明

| 参数 | 说明 | 是否必填 |
| ---- | ---- | -------- |
| keyword | 查询关键字 | 否 |
| page | 页码 | 否 |

### 成功操作返回

```json
{
  "code": 200,
  "data": {
    data: [],
    meta: {
      {
        "count": 15,
        "current_page": 1,
        "per_page": 20,
        "total": 15,
        "total_pages": 1
      }
    }
  },
  "errorCode": 0,
  "msg": "success"
}
```

### 响应code

200: 成功，返回信息列表
其他: 失败，返回错误信息

## 获取当前用户发布的信息

```http
GET /api/v1/message/mine
```

### 参数说明

无

### 成功操作返回

```json
{
  "code": 200,
  "data": {
    data: [],
    meta: {
      {
        "count": 15,
        "current_page": 1,
        "per_page": 20,
        "total": 15,
        "total_pages": 1
      }
    }
  },
  "errorCode": 0,
  "msg": "success"
}
```

### 响应code

200: 成功，返回信息列表
其他: 失败，返回错误信息

## 获取所有用户发布的信息

```http
GET /api/v1/message/all
```

### 参数说明

| 参数 | 说明 | 是否必填 |
| ---- | ---- | -------- |
| page | 页码 | 否 |

### 成功操作返回

```json
{
  "code": 200,
  "data": {
    data: [],
    meta: {
      {
        "count": 15,
        "current_page": 1,
        "per_page": 20,
        "total": 15,
        "total_pages": 1
      }
    }
  },
  "errorCode": 0,
  "msg": "success"
}
```

### 响应code

200: 成功，返回信息列表
其他: 失败，返回错误信息

## 获取分享给当前用户的信息下的其他用户反馈列表

```http
GET /api/v1/message/feedbacklist
```

### 参数说明

| 参数 | 说明 | 是否必填 |
| ---- | ---- | -------- |
| keyword | 查询关键字 | 否 |
| page | 页码 | 否 |

### 成功操作返回

```json
{
  "code": 200,
  "data": {
    data: [],
    meta: {
      {
        "count": 15,
        "current_page": 1,
        "per_page": 20,
        "total": 15,
        "total_pages": 1
      }
    }
  },
  "errorCode": 0,
  "msg": "success"
}
```

### 响应code

200: 成功，返回反馈列表
其他: 失败，返回错误信息