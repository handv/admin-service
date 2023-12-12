const { Labels } = require('@models/labels')

class LabelsDao {

  // 获取标签详情
  static async detail() {
    try {
      const labels = await Labels.findOne();      
      if (!labels) {
        return [null, []]
      }
      const labelString = labels.labels;
      labels.labels =
        labelString.split('$*$').map((tag) => tag.replace(/"/g, '')) || []
      return [null, labels]
    } catch (err) {
      return [err, null]
    }
  }

  // 更新标签
  static async update(data) {
    let label_data = await Labels.findOne();
    let set = new Set();
    
    if(label_data) {
      set = new Set(label_data.split('$*$'));
    }else {
      label_data = new Labels();
    }

    // 是否有上传新标签
    let change = false;
    for(let item of data) {
      if(!set.has(item)) {
        set.add(item);
        change = true;
      }
    }
    try {
      // 如果有新标签，则保存
      if(change) {
        label_data = [...set].join('$*$');
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
