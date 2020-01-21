const express = require('express')
const router = express.Router()

// 导入路由模块
const login = require('./login.js')
const register = require('./register.js')
const test = require('./test.js')
const getData = require('./getData')
const sendData = require('./sendData')
const modify = require('./modify')
const webc = require('./jinyuu/webc')

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

// 网站收藏
router.use(webc)

module.exports = router
