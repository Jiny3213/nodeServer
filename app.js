var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var session = require('express-session')

var router = require('./router/router.js')

var server = express()

// 处理vue-history
var history = require('connect-history-api-fallback')
server.use(history())

// 开放public目录
server.use('/public/', express.static(path.join(__dirname, './public/')))
server.use(express.static(path.join(__dirname, './dist/')))

// 获取post请求体中间件
server.use(bodyParser.urlencoded({extended: false}))
server.use(bodyParser.json())

// 配置session，必须在加载路由之前
server.use(session({
  secret: 'keyboard cat', // 配置加密字符串
  resave: false,
  saveUninitialized: true ,// 无论是否使用session都给你一把钥匙
  cookie: {
    // sameSite: 'lax',
    maxAge: 1000 * 60 * 60
  }
}))

// 允许跨域访问
server.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  res.header('Access-Control-Allow-Headers', 'Content-Type, authorization')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Content-Type', 'application/json;charset=utf-8')
  next()
})


// 加载路由
server.use(router)

// 处理404
server.use(function(req, res) {
	res.status(404).send(require('fs').readFileSync('./views/404.html', 'utf8'))
})

// 处理错误
// server.use(function(err, req, res, next) {
// 	console.log('报错了')
// })

// server.listen(8888, function() {
// 	console.log('服务器开始运行：localhost:8888')
// })
server.listen(80, function() {
	console.log('服务器开始运行：http://101.132.237.93')
})
