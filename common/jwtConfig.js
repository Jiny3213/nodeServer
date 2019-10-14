const jwt = require('jsonwebtoken')

const jwtSecret = 'hahaha'
const expireTime = '2h'

function signToken(data) {
  return jwt.sign(data, jwtSecret, {
    expiresIn: expireTime
  })
}

function verifyToken(token) {
  return new Promise(function(resolve, reject) {
    jwt.verify(token, jwtSecret, function(err, decoded) {
      if(err) reject(err)
      else resolve(decoded)
    })
  })
}

function parseToken(token) {
  var newToken = token.replace('Bearer ', '')
  return verifyToken(newToken)
}

// // 测试用例
// var token = signToken({foo: 'bar'}) 
// console.log(token)
// var verify = function() {
//   return verifyToken(token).then(data => console.log(data))
//   .catch(err => console.log(err)) 
// }
// // 成功的认证
// verify()
// // 设置过期时间为1秒，模拟过期
// setTimeout(verify, 2000)


module.exports = {
  signToken,
  verifyToken,
  parseToken
}