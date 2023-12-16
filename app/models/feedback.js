const moment = require('moment');

const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('@core/db')

class Feedback extends Model {

}

Feedback.init(
  {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: '反馈主键ID',
    },
    fb1: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: '反馈ip内容',
    },
    fb2: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: '反馈domain内容',
    },
    fb3: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: '反馈md5内容',
    },
    message_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      comment: '关联的反馈信息ID',
    },
    user_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true,
      defaultValue: 0,
      comment: '反馈用户ID',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: '创建时间',
      get() {
        return moment(this.getDataValue('created_at')).format(
          'YYYY-MM-DD HH:mm:ss'
        )
      },
    },
  },
  {
    sequelize,
    modelName: 'feedback',
    tableName: 'feedback',
  }
)

module.exports = {
  Feedback
}
