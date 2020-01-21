/**
 * Router
 */
const express = require('express');
const router = express.Router();
const webc = require('../../db/jinyuu/webc')

router.get('/api/webc', async (req, res) => {
  let data = await webc.getWebc()
  res.status(200).json(data)
})

// 创建新的收藏类别
router.post('/api/webc/createwebc', async (req, res) => {
  let name = req.body.name
  console.log(req.body)
  if(name.trim()) {
    await webc.createWebc(name)
    res.status(200).json({
      code: 0,
      msg: 'success'
    })
  }
  else {
    res.status(400).json({
      code: -1,
      msg: 'null'
    })
  }
})
// 往指定的类别中新增网址
router.post('/api/webc/createcole', async (req, res) => {
  let {webcId, name, url} = req.body
  console.log(req.body)
  if(name.trim() && url.trim()) {
    await webc.createCollection(webcId, name, url)
    res.status(200).json({
      code: 0,
      msg: 'success'
    })
  }
  else {
    res.status(400).json({
      code: -1,
      msg: 'null'
    })
  }
})

// 删除收藏夹
router.post('/api/webc/deletewebc', async (req, res) => {
  let webcId = req.body.webcId
  await webc.deleteWebc(webcId)
  res.status(200).json({
    code: 0,
    msg: 'success'
  })
})

router.post('/api/webc/deletecole', async (req, res) => {
  let {webcId, collectionId} = req.body
  await webc.deleteCollection(webcId, collectionId)
  res.status(200).json({
    code: 0,
    msg: 'success'
  })
})

module.exports = router;
