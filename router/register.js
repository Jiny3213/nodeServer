const jwt = require('../common/jwtConfig')
const express = require('express')
const router = express.Router()
const {createUser, testExist} = require('../db/userCRUD.js')

var isEmailAvailable = false
var isUsernameAvailable = false
var isPasswordAvailable = false

// 验证邮箱(非空，长度，是否符合正则)
function verifyEmail(email) {
  if(!email || email.length > 30) {
    isEmailAvailable = false
  }
  else if(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)) {
    isEmailAvailable = true
    emailTips = '√'
  }
  else {
    isEmailAvailable = false
  }
}
//验证昵称(非空，长度，不含空格)
function verifyUsername(username) {
  if(!username || username.length < 2 || username.length > 10 || /\s/.test(username)) {
    isUsernameAvailable = false
  }
  else {
    isUsernameAvailable = true
  }
}
// 验证密码（非空，长度，不含空格）
function verifyPassword(password) {
  if(!password || password.length < 6 || password.length > 12 || /\s/.test(password)) {
    isPasswordAvailable = false
  }
  else {
    isPasswordAvailable = true
  }
}
// 验证函数整合
function verifyUser({username, email, password}){
  verifyEmail(email)
  verifyUsername(username)
  verifyPassword(password)
  if(isEmailAvailable && isUsernameAvailable && isPasswordAvailable) {
    return true
  }
}

// 注册
router.post('/register', function(req, res) {
	var user = {username, email, password} = req.body
	console.log(`${username}正在注册`)
  // 验证注册信息是否合法
  if(!verifyUser(user)) {
    console.log('越过前端校验的非法注册！！')
    res.status(403).json({
      msg: 'fail'
    })
    return
  }
  createUser(user).then(err => {
    if(!err) {
      // 注册成功，发送token
      res.status(200).json({
      	msg: 'ok',
        token: jwt.signToken({
          email: email,
          username: username
        }),
        user: {
          username
        }
      })
      return
    }
    if(err.errType == 'duplicate') {
      // 用户名重复
      if(err.errKey == 'username') {
        res.status(200).json({
          msg: 'fail',
          err: 'username'
        })
      }
      // 邮箱重复
      else if(err.errKey == 'email') {
        res.status(200).json({
          msg: 'fail',
          err: 'email'
        })
      }
    }
  })
})

// 验证用户名/邮箱是否存在
router.get('/api/testexist', function(req, res) {
  var key = req.query.key
  var value = req.query.value
  testExist({key, value}).then(msg => {
    if(msg) {
      // 重复
      res.status(200).json({
        msg: 'fail'
      })
    }
    else {
      res.status(200).json({
        msg: 'ok'
      })
    }
  })
})

module.exports = router