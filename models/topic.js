const mongoose = require('mongoose')
const Schema = mongoose.Schema
const commentSchema = require('./children/comment')

var topicSchema = new Schema({
	topic_id: {
    type: Number,
    required: true,
    index: true,
    unique: true
  },
  author: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    required: true
  },
  // -1不可用，0正常，1置顶
  status: {
    type: Number,
    default: 0
  },
  title: {
    type: String,
    required: true,
    maxlength: 20
  },
  browsed: {
    type: Number,
    default: 0
  },
  prefer: {
    type: Number,
    default: 0
  },
  create_time: {
  	type: Date,
  	default: Date.now
  },
  last_modify_time: {
  	type: Date,
  	default: Date.now
  },
  content: {
    type: String,
    required: true
  },
  comments: [commentSchema],
})


module.exports = mongoose.model('Topic', topicSchema)