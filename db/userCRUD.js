const db = require('./connect.js')
const User = require('../models/user.js')
const md5 = require('blueimp-md5')
const pwdKey = 'jinyuu'

// MD5加密用户密码
function _md5(password) {
  return md5(password, pwdKey)
}

// 注册：新增用户数据,接受一个对象，包含email, password, username
// 成功则返回null
// 失败则返回一个错误对象，描述了错误类型，重复的key
function createUser(userdata) {
  var {email, username, password} = userdata
  password = _md5(password)
  // 构造user documents
  var user = new User({email, username, password})
  // 写入数据库
  return user.save().then(user => {
    return null
  }).catch(err => {
    if(err.keyValue) {
      var errKey = Object.keys(err.keyValue)[0]
      return {
        errType: 'duplicate',
        errKey: errKey,
      }
    }
    else {
      // 不知道发生了什么错误
      return {
        errType: 'unknown'
      }
      console.log(err)
    }
    
  })
}

// 查询邮箱或用户名是否已经存在
function testExist(userdata) {
  var {key, value} = userdata
  return User.findOne({[key]: value}).then(user => {
    // 数据重复
    if(user) {
      return 'isExist'
    }
    else {
      return null
    }
  }).catch(err => {
    throw new Error('查询出错')
  })
}

// 认证用户登录，接受一个对象，包含用户的邮箱和密码，返回promise对象
// 认证成功，则返回数据库中的用户信息user
// 认证失败，查找失败、用户名不存在、密码错误都返回null
// 使用exec则传入两个参数err和user，使用then则只会传入一个参数user
function verifyUser(userdata) {
  var {email, password} = userdata
  // 第二个参数可以传入{username: 1, password: 1, _id: 0}
  return User.findOne({email}).then(user => {
    if(!user) {
      console.log('查找成功，用户不存在')
      return null
    }
    var md5Password = user.password
    if(_md5(password) == md5Password) {
      console.log('用户认证成功')
      return user
    }
    else {
      console.log('查找成功，用户密码错误');
      return null
    }
  }).catch(err => {
    console.log('查找用户失败')
    console.log(err)
    return null
  })
}

function modPassword(email, newpwd) {
  newpwd = _md5(newpwd)
  return User.findOneAndUpdate({email}, {$set: {password: newpwd}})
}

// 设置头像
function setAvatar(email, filename) {
  return User.findOneAndUpdate({email}, {$set: {avatar: filename}})
}

// 查找头像
function getAvatar(email) {
  return User.findOne({email}).then(user => {
    return user.avatar
  })
}

// 这样获取时间戳
// User.find().then(users => {
//   console.log(users[0].create_time.getTime())
// })

// 测试创建
// createUser({
//   username: 'Jiny',
//   password: '123456',
//   email: '123@qq.com'
// }).then(err => {
//   console.log(err) // 此处受到err
// })

// 测试认证
// verifyUser({
//   email: '123a@qq.com',
//   password: '123456'
// })

// 测试重复
// testExist({
//   key: 'email',
//   value: '123@qq.com'
// }).then(msg => {
//   if(msg) {
//     console.log(msg)
//   }
//   else {
//     console.log('可以注册')
//   }
// })

// 修改默认头像
// function resetAvatar() {
//   return User.updateMany(null, {$set: {avatar: ''}}).then(data => {
//     console.log('完成')
//     console.log(data)
//   })
// }
// resetAvatar()

module.exports = {
  createUser,
  verifyUser,
  testExist,
  getAvatar, setAvatar,
  modPassword
}



