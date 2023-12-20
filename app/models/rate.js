const moment = require('moment');

const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('@core/db')

class Rate extends Model {

}

Rate.init(
  {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: '评价主键ID',
    },
    ip: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        score: 0,
        correct: 0
      },
      comment: 'ip评价',
    },
    domain: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        score: 0,
        correct: 0
      },
      comment: 'domain评价',
    },
    md5: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        score: 0,
        correct: 0
      },
      comment: 'md5评价',
    },
    message_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      comment: '关联的评价信息ID',
    },
    user_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true,
      defaultValue: 0,
      comment: '评价用户ID',
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
    modelName: 'rate',
    tableName: 'rate',
  }
)

module.exports = {
  Rate
}
