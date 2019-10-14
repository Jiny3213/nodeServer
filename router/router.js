var express = require('express')
// var md5 = require('blueimp-md5')
var router = express.Router()
// var User = require('./models/user.js')
var fs = require('fs')
const pfs = require('../common/promiseFs.js')

// 导入路由模块
const login = require('./login.js')
const test = require('./test.js')
const register = require('./register.js')
const handler = require('./handler.js')
// 首页
router.get('/', function(req, res) {
	res.status(200).send('hello')
})

// 注册
router.post('/register', register)

// 验证用户名是否存在
router.get('/testusername', function(req, res) {
  var username = req.query.username
  pfs.readFile('../db/users.json')
    .then(users => {
      var usersArr = JSON.parse(users)
      var user = usersArr.find(u => u.username == username)
      var available
      user ? available = false : available = true
      res.status(200).json({
        available
      })
    })
})

// 用户登录
router.post('/login', login)

// 退出登录
router.get('/logout', function(req, res) {
	req.session.user = null
	// delete req.session.user
	res.redirect('/public/img/banner/banner1.jpg')
})

// api
router.get('/topic', (req, res) => {
  fs.readFile('./public/json/topics.json', 'utf8', (err, data) => {
    if(err) console.log(err)
    res.status(200).json(JSON.parse(data))
  })
})

// 获取轮播图
router.get('/banner', (req, res) => {
  let banners = [
    '/public/img/banner/banner1.jpg',
    '/public/img/banner/banner2.jpg',
    '/public/img/banner/banner3.jpg'
  ]
  res.status(200).json(banners)
})

// 测试
router.get('/test', test)

// 获取登录相关态
router.get('/getuser', handler)

module.exports = router