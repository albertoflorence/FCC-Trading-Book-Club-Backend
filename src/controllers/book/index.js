const {Books, Trades} = require('../../models')
const Promise = require('bluebird')
const gBookApi = require('./gBookApi')
const handleErrors = require('../../handlers/handleErrors')
const {reverse, getType} = require('./util')

const getOne = async (req, res, next) => {
  const {fields, query, skip} = req.query  
  try {
    const {bookId} = req.params
    let book = await Books.findOne({bookId})
    if ( !book ) {
      book = await gBookApi.getById(bookId)
    }
    return res.send(book)
  } catch (err) {
    return next({status: 404, message: 'resource not found'})
  }
}
const get = async (req, res, next) => {
  const {limit, fields, q, filter, skip, operator} = req.query
  try {
    if (q) {
      const books = await gBookApi.search(q)
      return res.send(books)
    }
    const cursor = Books.find(filter, fields).hint({ $natural : -1 })
    if (limit) {
      cursor.limit(limit)
    }
    return res.send(await cursor.toArray())
  } catch (err) {
    console.log(err)
    next(err)
  }
}
const create = async (req, res, next) => {
  try {
    const {bookId} = req.body
    if (!bookId) return next({status: 404, message: 'not found'})
    const isOnDatabase = await Books.findOne({bookId})
    if (isOnDatabase) return next()
    const book = await gBookApi.getById(bookId)
    await Books.insertOne(book)
    return next()
  } catch ( err ) {
    next(err)
  }
  
}
const register = async (req, res, next) => {
  try {
    const {type, bookId} = req.body
    if (!bookId ) return next({status: 422, message: 'bookId is require'})
    const user = req.user.userName
    const trade = await Trades.findOne({
      $and: [
        {$or: [{bookId: bookId}, {bookIdTarget: bookId}]},
        {$or: [{user: user}, {userTarget: user}]},
        {status: 'pending'}
      ]
    }, {_id: true})
    if ( trade ) return next({status: 422, message: 'you have a pending on this book'})
    const result = await Books.toogleAndCount(type, reverse(type), {bookId}, user)
    res.send(result.value)
  } catch ( err ) {
    next(err)
  }
}

const matchUsers = async (req, res) => {
  try {
    const {bookId} = req.params
    const user = req.user.userName
    const {type, book} = await getType(bookId, user)
    if (!type) return res.send()
    const inverseType = reverse(type)
    const users = book[inverseType]
    if (!users || users.length < 1) return res.send()
    
    let usersThatMatchs = await Books.aggregate([
      {$unwind: '$' + type},
      {$match: { $and: [{[type]: {$in: users}}, {bookId: {$ne: bookId}}]}},
      {$match: {[inverseType]: user}},
      {$group: {_id: {user: '$' + type}}},
      {$project: {user: 1, _id: 1}}
    ])
    .map(e => e._id.user)
    .toArray()
    res.send(usersThatMatchs)
  } catch ( err ) {
    console.log(err)
    res.status(500).send(err)
  }
}

const matchBooks = async (req, res) => {
  try { 
    const user = req.user.userName
    const {target} = req.params
    const targetWant = Books.find(
      {ownedBy: user, requestedBy: target}
    ).toArray()
    const userWant = Books.find(
      {ownedBy: target, requestedBy: user}
    ).toArray()
  
    const books = await Promise.all([targetWant, userWant]).then(([toOffer, toReceive]) => ({toOffer, toReceive}))
    res.send(books)
  } catch ( err ) {
    console.log(err)
    res.status(500).send(err)
  }
}

module.exports = {
  get, getOne, register, create, matchUsers, matchBooks
}