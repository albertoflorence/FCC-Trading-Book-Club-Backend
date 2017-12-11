const {ObjectId} = require('mongodb')
const {Notifications} = require('../models')
const formatTime = require("../handlers/formatTime")

const getMsg = (type, sender) => {
  let msg = sender + ' '
  switch (type) {
    case 'tradeRequest':
      msg += "is trying to trade a book with you"
      break
  }
  return msg
}

const get = async (req, res) => {
  try {
    const user = req.user.userName
    const notificationsRaw = await Notifications.find({receiver: user}).limit(15).sort({createdAt: -1}).toArray()
    const notifications = notificationsRaw.map(el => ({
      _id: el._id,
      sender: el.sender,
      msg: getMsg(el.type, el.sender),
      time: formatTime(new Date().getTime() - el.createdAt) + ' ago',
      link: el.link,
      seen: el.seen
    }))
    res.send(notifications)
  } catch ( err ) {
    console.log(err)
    res.status(500).send(err)
  }
}

const update = async (req, res) => {
  try {
    const user = req.user.userName
    const {id} = req.params
    const update = req.body
    await Notifications.update({_id: ObjectId(id), receiver: user}, {$set: update})
    res.send()
  } catch ( err ) {
    console.log(err)
    res.status(500).send(err)
  }
}

const destroy = async (req, res) => {
  try {
    const user = req.user.userName
    const {id} = req.params
    await Notifications.deleteOne({_id: ObjectId(id), receiver: user})
    res.send()    
  } catch ( err ) {
    console.log( err )
    res.status(500).send(err)
  }
}

module.exports = {
  get, update, destroy
}
