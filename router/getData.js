const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const jwt = require('../common/jwtConfig.js')

// 验证是否登录的中间件
const {checkLogin} = require('./handler')

// 操作数据库
const {createTopic, createComment, getCommentFloor} = require('../db/topicCRUD.js')
const {getAvatar, setAvatar} = require('../db/userCRUD.js')

// 获取评论模型
// const newComment = require('../models/inner/comment.js')

// 获取上传数据
const upload = require('../common/multerConfig.js')

// 路由

// 接受用户发送的文章
router.post('/topic', checkLogin, function(req, res) {
  var topic = {author, tag, title, content} = req.body
  createTopic(topic)
    .then(err => {
      if(err) {
        console.log(err)
        res.status(500).json({
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


// 接受用户发送的评论
router.post('/api/comment', checkLogin, function(req, res) {
  // 这里可能要验证一下数据
  var {commenter, content, topicId} = req.body
  // 获取楼层
  getCommentFloor(topicId)
    .then(floor => {
    var comment = {commenter, content, floor}
    createComment(topicId, comment)
      .then(raw => {
        res.status(200).json({
          msg: 'ok'
        })
      })
      .catch(err => {
        console.log('新增评论失败')
        res.status(500).json({
          msg: 'fail'
        })
        throw err
      })
  })
})

// 接受用户发送的头像
router.post('/api/setAvatar', checkLogin, upload.single('avatar'), function(req, res) {
  // 先检查用户是否设置过头像，若设置过，删除旧头像
  getAvatar(req.tokenData.email).then(filename => {
    // 若用户曾经上传过头像，则删除旧头像
    if(filename) {
      fs.unlink(path.join(__dirname, '../uploads/face/' + filename), err => {
        if(err) console.log(err.message)
      })
    }
    // 若用户没有上传过头像，直接进入下一步
    
    // 新头像写进数据库
    setAvatar(req.tokenData.email, req.file.filename).then(data => {
      // console.log('这是更新前的数据')
      // console.log(data)
      // console.log(`更新后的文件是：${req.file.filename}`)
    })
    res.status(200).json({
      msg: 'ok',
      // 修改token并发送，不够优雅，相当于把登录工作又做了一遍
      token: jwt.signToken({
          email: req.tokenData.email,
          username: req.tokenData.username,
          avatar: req.file.filename
      }),
      user: {
        username: req.tokenData.username,
        avatar: req.file.filename
      },
    })
  })
  
})

module.exports = router