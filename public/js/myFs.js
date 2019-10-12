const fs = require('fs')
const util = require('util')

const readFile = util.promisify(fs.readFile)

exports.readFile = readFile
