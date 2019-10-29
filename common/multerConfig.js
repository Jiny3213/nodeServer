// 处理文件的中间件multer
const multer = require('multer')
const path = require('path')
const uuidv1 = require('uuid/v1')

// 配置multer的文件路径
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/face'));
  },
  filename: function (req, file, cb) {
    cb(null, uuidv1() + '.jpg');
  }
})
var upload = multer({storage: storage, preservePath: true})

module.exports = upload