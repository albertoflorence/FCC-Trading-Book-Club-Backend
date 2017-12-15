const {Trades, Notifications, Books} = require('../models')
const handleErrors = require('../handlers/handleErrors')
const {ObjectId, items} = require('mongodb')

const create = async (req, res) => {
  const {bookId, bookIdTarget, userTarget} = req.body
  const user = req.user.userName
  const hasRequested = await Trades.findOne({bookIdTarget, bookId, userTarget, user}) 
  if (hasRequested) return res.status(400).send({message: 'already requested'})
  
  const result = await Trades.insertOne({user, bookId, bookIdTarget, userTarget, status: 'pending'})
  Notifications.create({sender: user, receiver: userTarget, type: 'trade_request'})
  if (result) return res.status(201).send({code: 'success'})
}

const getOne = async (req, res) => {
  const {fields, filter} = req.query
  const user = req.user.userName
  const trade = await Trades.findOne({$or:[{user}, {userTarget: user}], ...filter}, fields)
  res.send(trade)
}

const get = async (req, res) => {
  let {fields, filter} = req.query
  const user = req.user.userName
  const trades = await Trades.find({$or:[{user: user}, {userTarget: user}], ...filter}, fields).hint({ $natural : -1 }).toArray()
  return res.send(trades)
}

const acceptAnswer = (trade) => {
  const updatePromise = Trades.updateMany({
    status: 'pending',
    $and: [
      {$or: [{bookId: trade.bookId}, {bookId: trade.bookIdTarget}, {bookIdTarget: trade.bookId}, {bookIdTarget: trade.bookIdTarget}]},
      {$or: [{userTarget: trade.user}, {userTarget: trade.userTarget}, {user: trade.user}, {user: trade.userTarget}]}
    ]
  }, {
    $set: {status: 'cancel'}
  })

  const bookBulk = Books.initializeOrderedBulkOp()
  bookBulk.find({bookId: trade.bookId})
  .updateOne({
    $push: {ownedBy: trade.user},
    $pull: {requestedBy: trade.user},
    $inc: {requestedByCount: -1}
  })
  bookBulk.find({bookId: trade.bookId})
  .updateOne({
    $pull: {ownedBy: trade.userTarget}
  })
  bookBulk.find({bookId: trade.bookIdTarget})
  .updateOne({
    $push: {ownedBy: trade.userTarget},
    $pull: {requestedBy: trade.userTarget},
    $inc: {requestedByCount: -1}
  })
  bookBulk.find({bookId: trade.bookIdTarget})  
  .updateOne({
    $pull: {ownedBy: trade.user}
  })
  return Promise.all([updatePromise, bookBulk.execute()])
}

const answer = async (req, res, next) => {
  try {
    const {answer} = req.body
    const {id} = req.params
    const user = req.user.userName
    let result
    if (answer !== 'accept' && answer !== 'reject' && answer !== 'cancel') return next({status: 422, message: 'not a valid answer'})

    if (answer === 'cancel') {
      const {value} = await Trades.findOneAndUpdate({
        _id: ObjectId(id),
        user: user,
        status: 'pending'
      }, {
        $set: {status: 'cancel'}
      })
      result = value
    } else {
      const {value} = await Trades.findOneAndUpdate({
        _id: ObjectId(id),
        userTarget: user,
        status: 'pending'
      }, {$set: {status: answer}})
      if (!value) return next({status: 422, message: 'invalid'})
      if (answer === 'accept') {
        await acceptAnswer(value)
      }
      result = value
    }
    
    await Notifications.create({sender: result.userTarget, receiver: result.user, type: 'trade_' + answer})

    res.send({code: 'success'})
  } catch (err) {
    next({status: 500, err})
  }

}

module.exports = {
  get, getOne, create, answer
}