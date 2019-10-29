const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 评论的数据结构
// module.exports = function newComment({commenter, timestamp, content}) {
//   var comment = {
//     // 查库取length确定floor
//     floor: 0,
//     status: 0,
//     commenter: commenter,
//     timestamp: timestamp,
//     content: content,
//     prefer: 0
//   }
//   return comment
// }

var commentSchema = new Schema({
  floor: {
    type: Number,
    required: true
  },
  commenter: {
    type: String,
    required: true,
  },
  create_time: {
    type: Date,
    default: Date.now
  },
  content: {
    type: String,
    required: true
  },
  prefer: Number,
  default: 0
})

// module.exports = mongoose.model('Comment', commentSchema)
module.exports = commentSchema