var express = require('express')
var router = express.Router()
var {getTopics, getCount, getTopic, addBrowsed, searchByTitle} = require('../db/topicCRUD.js')

// 访问首页，发送10个文章的部分讯息，同时发送文章总数
router.get('/api/topics', function(req, res) {
  var page = req.query.page
  var tag = req.query.tag
  var topicsCount
  var topicsArr
  // 获取文章总数
  var tagArg
  if(tag == '全部' || tag == '精华') {
    tagArg = null
  }
  else tagArg = tag
  var getCountPromise = getCount(tagArg)
    .then(count => {
      topicsCount = count
    })
  
  // 获取10个文章数据
  var getTopicsPromise = getTopics(page, tag)
    .then(topics => {
      // 考虑去除文章内容，评论只发评论数、最后评论人，最后评论时间，加快响应速度
      topics = topics.map(topic => {
        topic.authorAvatar = topic.author_data.avatar
        delete topic.author_data
        return topic
      })
      topicsArr = topics
    }) 
  
  // 当数据获取完毕
  Promise.all([getCountPromise, getTopicsPromise])
    .then(() => {
      res.status(200).json({
        totalTopics: topicsCount,
        topics: topicsArr
      })
    })
})

// 根据id发送文章
router.get('/api/topic', function(req, res) {
  var topic_id = req.query.topic_id
  // topic_id是一个字符串，坑死个人
  var id = parseInt(topic_id)
  // 增加浏览量
  addBrowsed(id)
    .then(() => {
      getTopic(id)
        .then(topic => {
          if(!topic) {
            // 没有这篇文章
            res.status(404).json({
              msg: 'fail'
            })
            return null
          }
          res.status(200).json({
            msg: 'ok',
            topic
          })
        })
    })
    // 查找出错
    .catch(err => {
      console.log(err)
      res.status(500).json({
        msg: 'fail'
      })
    })
})

// 根据字符搜索文章标题，返回10个文章
router.get('/api/search', function(req, res) {
  var str = req.query.str
  var page = parseInt(req.query.page)
  
  // 获取文章总数
  getCount(null, str)
    .then(count => {
      if(count == 0) {
        // 什么都没找到
        res.status(200).json({
          msg: 'fail'
        })
      } 
      else {
        // 搜索文章内容
        searchByTitle(str, page)
          .then(topics => {
            res.status(200).json({
              msg: 'ok',
              topics,
              totalTopics: count
            })
          })
      }
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


module.exports = router


