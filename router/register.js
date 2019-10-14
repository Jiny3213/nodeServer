const jwt = require('../common/jwtConfig')
const pfs = require('../common/promiseFs.js')

var isEmailAvailable = false
var isUsernameAvailable = false
var isPasswordAvailable = false

// 验证邮箱
function verifyEmail(email) {
  if(!email || email.length > 30) {
    isEmailAvailable = false
  }
  else if(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)) {
    isEmailAvailable = true
    emailTips = '√'
  }
  else {
    isEmailAvailable = false
  }
}
//验证昵称(不验证重名)
function verifyUsername(username) {
  if(!username || username.length < 2 || username.length > 10 || /\s/.test(username)) {
    isUsernameAvailable = false
  }
  else {
    isUsernameAvailable = true
  }
}
// 验证密码
function verifyPassword(password) {
  if(!password || password.length < 6 || password.length > 12 || /\s/.test(password)) {
    isPasswordAvailable = false
  }
  else {
    isPasswordAvailable = true
  }
}
// 验证函数整合
function verifyUser({username, email, password}){
  verifyEmail(email)
  verifyUsername(username)
  verifyPassword(password)
  if(isEmailAvailable && isUsernameAvailable && isPasswordAvailable) {
    console.log('长度没问题')
    return true
  }
}

function register(req, res) {
	var user = {username, email, password} = req.body
	console.log(`${username}正在注册`)
  // 验证注册信息是否合法
  if(!verifyUser(user)) {
    console.log('长度有问题')
    res.status(403).json({
      msg: 'fail'
    })
    return
  }
  pfs.readFile('../db/users.json')
    .then(usersJson => {
      var usersArr = JSON.parse(usersJson)
      // 验证用户是否重名
      if(usersArr.find(u => u.username == username)) {
        console.log('重名注册')
        res.status(403).json({
          msg: 'fail'
        })
        return
      }
      usersArr.push(user)
      pfs.writeFile('../db/users.json', JSON.stringify(usersArr))
      .then(() => {
        // 注册成功，发送token
        res.status(200).json({
        	msg: 'ok',
          token: jwt.signToken(user),
          user: {
            username
          }
        })
      })
      .catch(err => console.log(err))
    })
    .catch(err => {
      console.log(err)
    })
	//加密密码
	// body.password = md5(md5(body.password))
}

module.exports = register