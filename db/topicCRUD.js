const db = require('./connect.js')
const Topic = require('../models/topic.js')
const {getId} = require('./counterCRUD.js')

// 接收一个topic对象，应该在传入前校验数据合法性
// 返回一个err，没有err则成功
function createTopic({author, tag, title, content}) {
  // 获取id
  return getId('topic')
  .then(counter => {
      return counter.seq
  })
  // 保存文章
  .then(topic_id => {
    var topic = new Topic({author, tag, title, content, topic_id})
    return topic.save()
      .then(topic => {
        // 成功，什么也不返回
        console.log('文章创建成功')
        return
      })
      .catch(err => {
        // 保存文章出错，回滚id，返回err
        getId('topic', isRollback=true)
        return err
      })
  })
}

// 根据id获取文章，整合评论人的头像
function getTopic(topicId) {
  return Topic.findOne({topic_id: topicId})
  .then(topic => {
    // 如果没有评论，直接返回
    if(topic.comments.length === 0) return topic
    // 如果有评论,加上头像信息再返回
    else return Topic.aggregate([
      {$match: {topic_id: topicId}},
      // 拆开之前判断是否有comment
      // 此处拆开comments
      {$unwind: '$comments'},
      {$lookup: {
        from: 'users',
        let: {commenter: '$comments.commenter'},
        pipeline: [
          {$match: {$expr: {$eq: ['$username', '$$commenter']}}},
          {$project: {avatar: 1, _id: 0}},
        ],
        as: 'comments.commenter_avatar'
      }},
      {$unwind: '$comments.commenter_avatar'},
      // 把commenter_avatar从一个对象变成一个字符串：头像的信息
      {$addFields: {'comments.commenter_avatar': '$comments.commenter_avatar.avatar'}},
      // 此处又把comments合并起来
      {$group: {
        _id: '$_id',
        status: {$first: '$status'},
        browsed: {$first: '$browsed'},
        prefer: {$first: '$prefer'},
        author: {$first: '$author'},
        tag: {$first: '$tag'},
        title: {$first: '$title'},
        content: {$first: '$content'},
        topic_id: {$first: '$topic_id'},
        create_time: {$first: '$create_time'},
        last_modify_time: {$first: '$last_modify_time'},
        comments: {$push: '$comments'}
      }}
    ])
    .then(topicArr => topicArr[0])
  })
}

// 获取目前有多少篇文章
function getCount(tag=null, searchStr=null) {
  // 什么参数都不给，就是查找全部
  if(tag == null && searchStr == null) {
    return Topic.countDocuments()
  }
  else if(tag) {
    return Topic.countDocuments({tag})
  }
  else if(searchStr) {
    var re = new RegExp(searchStr, 'i')
    return Topic.countDocuments({title: {$regex: re}})
  }
}

// 创建新的评论
function createComment(topicId, comment) {
  return Topic.updateOne({topic_id: topicId}, {$push: {comments: comment}})
}

// 获取最新的楼层数
function getCommentFloor(topic_id) {
  return Topic.findOne({topic_id}).then(topic => {
    return topic.comments.length + 1
  })
}

// 根据页数，返回10个文章，顺便获取作者信息（头像
function getTopics(page, tag) {
  var skip = (page - 1) * 10
  var limit = 10
  if(tag == '全部' || tag == '精华') {
    return Topic.aggregate()
    .sort({status: -1, _id: -1})
    .skip(skip)
    .limit(limit)
    .lookup({
      from: 'users',
      localField: 'author',
      foreignField: 'username',
      as: 'author_data'
    })
    .unwind('$author_data')
  }
  else {
    return Topic.aggregate()
    .match({tag})
    .sort({status: -1, _id: -1})
    .skip(skip)
    .limit(limit)
    .lookup({
      from: 'users',
      localField: 'author',
      foreignField: 'username',
      as: 'author_data'
    })
    .unwind('$author_data')
  }
}

// 增加文章浏览量
function addBrowsed(topic_id) {
  return Topic.updateOne({topic_id}, {$inc: {browsed: 1}})
}

// 增加评论赞成数
// function addBrowsed(topic_id, floor) {
//   return Topic.updateOne({topic_id}, {$inc: {browsed: 1}})
// }

// 根据title搜索文章，返回10个
function searchByTitle(str, page) {
  var re = new RegExp(str, 'i')
  var skip = (page - 1) * 10
  var limit = 10
  return Topic.aggregate([
    {$match: {title: {$regex: re}}},
    {$sort: {_id: -1}},
    {$skip: skip},
    {$limit: limit},
    {$lookup: {
      from: 'users',
      localField: 'author',
      foreignField: 'username',
      as: 'author_data'
    }},
    {$addFields: {author_avatar: '$author_data.avatar'}},
    {$unset: 'author_data'},
    {$unwind: '$author_avatar'}
  ])
}

// 置顶文章
function topTopic(id) {
  return Topic.findOneAndUpdate({topic_id: id}, {$set: {status: 1}})
}
// topTopic(23).then(res => console.log(res))
// Topic.find().sort({status: -1, _id: -1}).then(res => console.log(res))

module.exports = {
  createTopic, 
  getTopic, 
  getTopics, 
  getCount, 
  createComment, 
  getCommentFloor,
  addBrowsed,
  searchByTitle,
  topTopic
  
}
  
  