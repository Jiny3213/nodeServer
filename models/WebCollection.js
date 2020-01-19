const mongoose = require('mongoose')
const Schema = mongoose.Schema

const docSchema = new Schema({
  name: String,
  url: String
})
const WebCollectionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  docs: [docSchema]
})

module.exports = mongoose.model('WebCollection', WebCollectionSchema)