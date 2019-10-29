var express = require('express')
var router = express.Router()

// 导入路由模块
const login = require('./login.js')
const register = require('./register.js')
const test = require('./test.js')
const getData = require('./getData')
const sendData = require('./sendData')
const modify = require('./modify')

// 注册
router.use(register)

// 用户登录
router.use(login)

// 获取用户发送的数据（文章
router.use(getData)

// 发送数据（文章，图片等
router.use(sendData)

// 修改用户数据
router.use(modify)

// 测试
router.use(test)

module.exports = router