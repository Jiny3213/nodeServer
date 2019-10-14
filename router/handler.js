const jwt = require('../common/jwtConfig.js')

module.exports = function(req, res, next) {
  var token = req.headers.authorization
  if(token) {
    jwt.parseToken(token)
      .then(data => {
        console.log(`来自已登录用户${data.username}的请求`)
        res.status(200).json({
          msg: 'ok',
          user: {username: data.username}
        })
      })
      .catch(err => {
        console.log('来自非法用户的请求')
        res.status(200).json({
          msg: 'unavailable'
        })
      })
  }
  else {
    console.log('用户未登录')
    res.status(200).json({
      msg: 'nolog'
    })
  }
  
}