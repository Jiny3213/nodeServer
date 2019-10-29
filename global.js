const path = require('path')
// 定义一个获取根路径的全局方法
global.PATH = function(__dirname, path) {
  var rootPath = __dirname.replace(/(?<=RaspberryForumServer).*/, '')
  return require('path').join(rootPath, path)
}