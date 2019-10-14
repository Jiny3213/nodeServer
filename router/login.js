const pfs = require('../common/promiseFs.js') 
const jwt = require('../common/jwtConfig.js')

const login = function(req, res) {
  var {username, password} = req.body
  pfs.readFile('../db/users.json')
    .then(users => {
      var usersArr = JSON.parse(users)
      var user = usersArr.find((u) => u.username == username)
      // 用户名错
      if(!user) {
        res.status(200).json({
          code: 1
        })
      }
      // 密码错
      else if(user.password != password) {
        res.status(200).json({
          code: 2
        })
      }
      // 登录成功
      else {
        console.log(`用户${username}已经登录`)
        req.session.user = user
        res.status(200).json({
          code: 0,
          token: jwt.signToken(user),
          user: {
            username: username
          },
        })
      }
    })
    .catch((err) => {
      console.log(err)
      console.log('读取用户信息出错')
      res.status(500).json({
        code: -1
      })
    })
} 

module.exports = login