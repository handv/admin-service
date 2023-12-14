const {Rule, LinValidator} = require('@core/lin-validator-v2')

class FeedbackValidator extends LinValidator {
  constructor() {
    super()

    this.name = [new Rule('isLength', 'name 不能为空', {min: 1})]

    this.value = [new Rule('isLength', 'value 不能为空', {min: 1})]
  }
}

class PositiveArticleIdParamsValidator extends LinValidator {
  constructor() {
    super()
    this.message_id = [new Rule('isInt', 'ID需要正整数', {min: 1})]
  }
}

module.exports = {
  FeedbackValidator,
  PositiveArticleIdParamsValidator,
}
