const jwt = require('../common/jwtConfig.js')

function checkLogin(req, res, next) {
  var token = req.headers.authorization
  if(token) {
    // token 中有email和username
    jwt.parseToken(token)
      .then(data => {
        // 为req新增一个属性，可以取到token信息
        req.tokenData = data
        console.log(`已登录用户${data.username}请求登录操作`)
        next()
      })
      .catch(err => {
        if(err) {
          console.log(`${err.message}: token非法或过期`)
          res.status(200).json({
            msg: 'login'
          })
        }
      })
  }
  else {
    console.log('用户未登录')
    res.status(200).json({
      msg: 'nologin'
    })
  }
}

module.exports = {checkLogin}