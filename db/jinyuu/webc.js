const Webc = require('../../models/webc.js')


// 创建新的收藏集合
function createWebc(webcTitle) {
  let webc = new Webc({
    name: webcTitle
  })
  webc.save().then(res => console.log(res))
}

// 删除收藏集合
function deleteWebc(webcId) {
  Webc.deleteOne({_id: webcId}).then(res => console.log(res))
}

// 添加新的网址
function createCollection(webcId, collectionTitle, url) {
  Webc.updateOne(
    {_id: webcId},
    {$push: {collections: {name: collectionTitle, url: url,}}}
  ).then(res => console.log(res))
}

// 删除网址
function deleteCollection(webcId, collectionId) {
  Webc.updateOne(
    {_id: webcId},
    {$pull: {collections: {_id: collectionId}}}
  ).then(res => console.log(res))
}

// 返回所有收藏集合
function getWebc() {
  return Webc.find().then(res => {
    console.log(res)
    return res
  })
}

// createWebc('abcjs')
// addCollection('nodejs', '官网2', 'nodejs.com')
// deleteWebc('5e26995792524836c458e51e')
// getWebc()
// deleteCollection('5e2680b86e78792aa83206ac', '5e26833540447236eccc7e93')

module.exports = {
  createWebc,
  deleteWebc,
  createCollection,
  deleteCollection,
  getWebc
}
