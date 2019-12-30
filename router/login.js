const jwt = require('../common/jwtConfig.js')
var express = require('express')
var router = express.Router()
const {verifyUser} = require('../db/userCRUD.js')
const svgCaptcha = require('svg-captcha')

// 用户登录
router.post('/login', function(req, res) {
  var {email, password, captcha} = req.body
  if(captcha !== req.session.captcha) {
    // 验证码错误
    res.status(200).json({
      msg: 'captcha wrong'
    })
    return 
  }
  verifyUser({email, password}).then(user => {
    // 登录成功，发送用户名和token
    if(user) {
      // 尝试使用session
      req.session.name = user.username
      console.log(req.session)
      res.status(200).json({
        msg: 'ok',
        // 储存在token中的数据
        token: jwt.signToken({
          email: user.email,
          username: user.username,
          avatar: user.avatar
        }),
        // 发送到客户端的数据
        user: {
          username: user.username,
          avatar: user.avatar
        },
      })
    }
    // 登录失败
    else {
      res.status(200).json({
        msg: 'fail'
      })
    }
  })
})

// 获取登录态
router.get('/getuser', function(req, res) {
  var token = req.headers.authorization
  if(token) {
    // 尝试获取session信息
    console.log(req.session)
    
    jwt.parseToken(token)
      .then(data => {
        console.log(`来自已登录用户${data.username}的请求`)
        res.status(200).json({
          msg: 'ok',
          // 读取token中的数据返回给用户
          user: {
            username: data.username,
            avatar: data.avatar
          }
        })
      })
      .catch(err => {
        console.log(err)
        console.log('来自非法用户的请求')
        res.status(200).json({
          msg: 'unavailable'
        })
      })
  }
  else {
    console.log('用户未登录')
    res.status(200).json({
      msg: 'nolog'
    })
  }
})

// 获取验证码
router.get('/api/captcha', function(req, res) {
  let captcha = svgCaptcha.create({
    ignoreChars: '0o1li',
    noise: 5,
  })
  // 验证码统一为小写字母
  req.session.captcha = captcha.text.toLowerCase()
  res.type('svg')
  res.status(200).send(captcha.data)
})

module.exports = router