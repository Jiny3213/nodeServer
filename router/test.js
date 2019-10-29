const jwt = require('../common/jwtConfig.js')
var express = require('express')
var router = express.Router()

function test(req, res) {
  if(req.headers.authorization) {
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
  else {
    res.status(200).json({
      msg: 'error'
    })
    console.log('testing')
  }
}
router.get('/test', test)

module.exports = router