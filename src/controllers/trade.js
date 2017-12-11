const {Trades, Notifications} = require('../models')
const handleErrors = require('../handlers/handleErrors')


const create = async (req, res) => {
  const {bookId, bookIdTarget, userTarget} = req.body
  const user = req.user.userName
  const hasRequested = await Trades.findOne({bookIdTarget, bookId, userTarget, user}) 
  if (hasRequested) return res.status(400).send({msg: 'already requested'})
  
  const result = await Trades.insertOne({user, bookId, bookIdTarget, userTarget, status: 'pending'})
  Notifications.create({sender: user, receiver: userTarget, type: 'tradeRequest', link: '/trade/' + result._id})
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
  console.log('aqui')
  const trades = await Trades.find([{$or:[{user}, {userTarget: user}], fields).toArray()
  console.log('aqui')
  
  return res.send(trades)
}

module.exports = {
  get, getOne, create
}