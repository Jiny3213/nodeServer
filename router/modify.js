const jwt = require('../common/jwtConfig.js')
const {verifyUser, modPassword} = require('../db/userCRUD.js')
const express = require('express')
var router = express.Router()
const {checkLogin} = require('./handler')

router.post('/mod/pwd', checkLogin, function(req, res) {
  var email = req.tokenData.email
  var oldpwd = req.body.oldpwd
  var newpwd = req.body.newpwd
  verifyUser({email, password: oldpwd})
    .then(user => {
      if(!user) {
        // 旧密码不正确
        res.status(200).json({
          msg: 'fail'
        })
        return
      }
      // 密码正确
      modPassword(email, newpwd)
        .then(somedata => {
          // console.log(somedata)
          res.status(200).json({
            msg: 'ok'
          })
        })
      
    })
})

module.exports = router