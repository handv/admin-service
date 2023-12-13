const { Labels } = require('@models/labels')

class LabelsDao {

  // 获取标签详情
  static async detail() {
    try {
      const labels = await Labels.scope('bh').findOne()      
      if (!labels) {
        return [null, []]
      }
      const labelString = labels.labels;
      labels.labels = JSON.parse(labelString) || []
      return [null, labels]
    } catch (err) {
      return [err, null]
    }
  }

  // 更新标签
  static async update(data) {
    try {
      let label_data = await Labels.findOne();
      const set = new Set(JSON.parse(label_data ? label_data.labels : '[]'));
      console.log(label_data, label_data ? typeof label_data.labels : 'ss', set)
      
      if(!label_data) {
        label_data = new Labels();
      }
  
      // 是否有上传新标签
      let change = false;
      for(let item of JSON.parse(data)) {
        if(!set.has(item)) {
          set.add(item);
          change = true;
        }
      }
      // 如果有新标签，则保存
      if(change) {
        label_data.labels = JSON.stringify([...set]);
        const res = await label_data.save()
        return [null, res]
      }
      return [null, label_data]
    } catch (err) {
      return [err, null]
    }
  }
}

module.exports = {
  LabelsDao
}
