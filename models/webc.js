const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {jinyuu} = require('../db/connect.js')

const coleSchema = new Schema({
  name: String,
  url: String
})
const webcSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  collections: [coleSchema]
})

// module.exports = {
//   webcModel:  mongoose.model('webc', webcSchema),
// }

module.exports = jinyuu.model('webc', webcSchema)
