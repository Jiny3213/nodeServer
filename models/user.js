var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/blog')

var Schema = mongoose.Schema

var userSchema = new Schema({
	email: {
		type: String,
		required: true
	},
	nickname: {
		type: String,
		required: true
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
		default: '/public/img/defaule-avatar'
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
	}
})

module.exports = mongoose.model('User', userSchema)