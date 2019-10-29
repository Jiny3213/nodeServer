const jwt = require('../common/jwtConfig.js')
var express = require('express')
var router = express.Router()
const {verifyUser} = require('../db/userCRUD.js')

// 用户登录
router.post('/login', function(req, res) {
  var {email, password} = req.body
  verifyUser({email, password}).then(user => {
    // 登录成功，发送用户名和token
    if(user) {
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


module.exports = router