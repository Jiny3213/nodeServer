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

const forum = mongoose.createConnection('mongodb://101.132.237.93:27017/forum', {
  authSource: 'admin',
  user: USER,
  pass: PASSWORD
})

const jinyuu = mongoose.createConnection('mongodb://101.132.237.93:27017/jinyuu', {
  authSource: 'admin',
  user: USER,
  pass: PASSWORD
})

// const db = forum.connection
forum.on('error', console.error.bind(console, 'connection error'))
forum.once('open', function() {
  console.log('数据库forum连接成功')
})

// const jinyuuDB = jinyuu.connection
jinyuu.on('error', console.error.bind(console, 'connection error'))
jinyuu.once('open', function() {
  console.log(`数据库jinyuu连接成功`)
})

module.exports = {forum, jinyuu}

