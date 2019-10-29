const mongoose = require('mongoose')

// 获取私密信息，此文件不会出现在github
const {USER, PASSWORD} = require('../secret.js')

// 改变promise
mongoose.Promise = global.Promise

// 防止警告
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useUnifiedTopology', true)
mongoose.set('useNewUrlParser', true)

// mongoose.connect('mongodb://localhost/test')
mongoose.connect('mongodb://101.132.237.93:27017/forum', {
  authSource: 'admin',
  user: USER,
  pass: PASSWORD
})

var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', function() {
  console.log('数据库连接成功')
})

module.exports = db

