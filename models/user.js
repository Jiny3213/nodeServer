const mongoose = require('mongoose')
const Schema = mongoose.Schema

var userSchema = new Schema({
  // 邮箱是唯一的，用于登录，有索引
	email: {
		type: String,
		required: true,
    index: true,
    unique: true
	},
  // 用户名也是唯一的
	username: {
		type: String,
		required: true,
    index: true,
    unique: true
	},
	password: {
		type: String,
		required: true
	},
	create_time: {
		type: Date,
		default: Date.now
	},
	last_modify_time: {
		type: Date,
		default: Date.now
	},
	avatar: {
		type: String,
		default: ''
	},
	bio: {
		type: String,
		default: ''
	},
	gender: {
		type: Number,
		// -1保密，0女，1男
		enum: [-1, 0, 1],
		default: -1
	},
	status: {
		type: Number,
		// 0正常，1不可以评论，2不可以登录
		enum: [0, 1, 2],
		default: 0
	},
  // 积分
  points: {
    type: Number,
    default: 0
  }
})


module.exports = mongoose.model('User', userSchema)