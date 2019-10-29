const db = require('./connect.js')
const Counter = require('../models/counter.js')

// 传入一个字符串，如topic，返回promise传入counter，通过counter.seq取得id
function getId(target, isRollback=false) {
  var incValue = 1
  // 是否回滚
  if(isRollback) {
    incValue = -1
  }
  // option: new-返回递增后的数据，upsert-如果没有找到数据，则新插入一个数据
  return Counter.findOneAndUpdate({target}, {$inc: {seq: incValue}}, {new: true, upsert: true})
}

// createCounter('target')
// getId('test', isRollback=true)

module.exports = {
  getId
}