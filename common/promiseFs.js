const fs = require('fs')
const util = require('util')
const path = require('path')

// const readFile = util.promisify(fs.readFile)
const readFile = function(relativePath, encoding='utf8') {
  return util.promisify(fs.readFile)(path.join(__dirname, relativePath), encoding)
}


const writeFile = function(relativePath, data) {
  return util.promisify(fs.writeFile)(path.join(__dirname, relativePath), data)
}

exports.readFile = readFile
exports.writeFile = writeFile