const moment = require('moment')

const {DataTypes, Model} = require('sequelize')
const {sequelize} = require('@core/db')

class MessageShare extends Model {}

MessageShare.init(
  {
    // 主键，唯一标识一个分享记录
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // 消息 ID
    message_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // 分享用户 ID
    share_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    modelName: 'message_share',
    tableName: 'message_share',
  }
)

module.exports = {
  MessageShare
}
