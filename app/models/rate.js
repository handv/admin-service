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
    rate1score: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '评价ip分数',
    },
    rate2score: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '评价domain分数',
    },
    rate3score: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '评价md5分数',
    },
    rate1correct: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '评价ip准确情况',
    },
    rate2correct: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '评价domain准确情况',
    },
    rate3correct: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '评价md5准确情况',
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
