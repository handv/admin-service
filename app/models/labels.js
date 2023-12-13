const moment = require('moment');

const { sequelize } = require('@core/db')
const { Model, DataTypes } = require('sequelize')

// 定义文章模型
class Labels extends Model {

}

// 初始分类模型
Labels.init(
  {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: '分类主键ID',
    },
    labels: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: '标签，字符串数组',
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
    modelName: 'labels',
    tableName: 'labels',
  }
)

module.exports = {
  Labels
}
