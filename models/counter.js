const mongoose = require('mongoose')
const Schema = mongoose.Schema

var counterSchema = new Schema({
	seq: {
    type: Number,
    default: 0
  },
  // counter的唯一标识
  target: {
    type: String,
    required: true,
    index: true,
    unique: true
  }
})


module.exports = mongoose.model('Counter', counterSchema)