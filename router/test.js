const jwt = require('../common/jwtConfig.js')

function test(req, res) {
  console.log(req.cookie)
  if(req.session.user) {
    console.log(req.session.user.username)
    console.log(req.cookie)
    res.status(200).json({
      code: 'good'
    })
  }
  else {
    jwt.parseToken(req.headers.authorization)
      .then(data => {
        res.status(200).json({
          code: 'bad',
          userinfo: data
        })
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({
          msg: 'error'
        })
      })
  }
}

module.exports = test