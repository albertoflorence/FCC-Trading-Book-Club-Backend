const {ObjectId} = require('mongodb')
const {Notifications} = require('../models')
const formatTime = require('../handlers/formatTime')

const getMessage = (type, sender) => {
  let message = sender + ' '
  switch (type) {
    case 'trade_request':
      return message += 'wants to trade a book with you'
    case 'trade_cancel':
      return message += 'canceled a trade that he requested'
    case 'trade_reject':
      return message += 'rejected your trade offer'
    case 'trade_accept':
      return message += 'accepted your trade offer'
  }
}

 const get = async (req, res) => {
  try {
    const user = req.user.userName
    const notificationsRaw = await Notifications.find({receiver: user}).limit(15).sort({createdAt: -1}).toArray()
    const notifications = notificationsRaw.map(el => ({
      _id: el._id,
      sender: el.sender,
      message: getMessage(el.type, el.sender),
      time: formatTime(new Date().getTime() - el.createdAt) + ' ago',
      seen: el.seen,
      type: el.type
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
