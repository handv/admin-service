const {
  Rule,
  LinValidator
} = require('@core/lin-validator-v2')

class MessageValidator extends LinValidator {
  constructor() {
    super()

    this.title = [new Rule('isLength', '标题 title 不能为空', {min: 1})]
  }
}

class PositiveIdParamsValidator extends LinValidator {
  constructor() {
    super();
    this.id = [
      new Rule('isInt', '文章ID需要正整数', { min: 1 })
    ]
  }
}

class ArticleSearchValidator extends LinValidator {
  constructor() {
    super();
    this.keyword = [
      new Rule('isLength', '必须传入搜索关键字', { min: 1 })
    ]
  }
}

module.exports = {
  MessageValidator,
  PositiveIdParamsValidator,
  ArticleSearchValidator,
}
