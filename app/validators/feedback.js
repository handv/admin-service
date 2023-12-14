const {
  Rule,
  LinValidator
} = require('@core/lin-validator-v2')

class FeedbackValidator extends LinValidator {
  constructor() {
    super()

    this.content = [
      new Rule("isLength", "content 不能为空", { min: 1 })
    ]

    // this.user_id = [
    //   new Rule("isLength", "user_id 不能为空", { min: 1 })
    // ]

    this.article_id = [
      new Rule("isLength", "article_id 不能为空", { min: 1 })
    ]
  }
}

class PositiveArticleIdParamsValidator extends LinValidator {
  constructor() {
    super();
    this.message_id = [new Rule('isInt', 'ID需要正整数', {min: 1})]
  }
}

module.exports = {
  FeedbackValidator,
  PositiveArticleIdParamsValidator
}
