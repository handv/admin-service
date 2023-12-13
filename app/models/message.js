const moment = require('moment');
const { sequelize } = require('@core/db')
const { Model, DataTypes } = require('sequelize')
// 定义文章模型
class Message extends Model {}

// 初始文章模型
Message.init(
  {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: '信息主键ID',
    },
    title: {
      type: DataTypes.STRING(128),
      allowNull: false,
      comment: '标题',
    },
    md5: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'md5',
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'ip地址',
    },
    domain: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '域名',
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 1,
      comment: '展示状态：0-隐藏,1-正常',
    },
    user_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      comment: '发布者ID',
    },
    labels: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: '标签ids',
    },
    share_users: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: '分享对象',
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
    modelName: 'message',
    tableName: 'message',
  }
)

module.exports = {
  Message
}
