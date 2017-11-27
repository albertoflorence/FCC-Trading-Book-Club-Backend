const {Books} = require('../models')
const Promise = require('bluebird') 
const api = require('google-books-search')
api.search = Promise.promisify(api.search)
api.lookup = Promise.promisify(api.lookup)

const filterData = data => {
  const { title, authors, thumbnail, publisher, description, id, publishedDate } = data
  if (title && authors && thumbnail && publisher && description && id && publishedDate) {
    return {
      title, 
      author: authors[0],
      thumbnail,
      publisher,
      description: description.slice(0, 280),
      googleId: id,
      publishedYear: publishedDate.length > 4 ? publishedDate.slice(0,4) : publishedDate,
    }
  }
  return null
}

const filterDetailedData = data => {
  const { title, authors, thumbnail, publisher, description, id, publishedDate } = data
  if (title && authors && thumbnail && publisher && description && id && publishedDate) {
    return {
      title, 
      author: authors[0],
      thumbnail,
      publisher,
      description: description.replace(/\s{2}/g, ''),
      googleId: id,
      publishedDate,
      publishedYear: publishedDate.length > 4 ? publishedDate.slice(0,4) : publishedDate,
      url_image: data.images.small,
      requestedBy: [],
      ownedBy: [],
    }
  }
  return null
}

const search = (req, res) => {
  const {query} = req.query
  api.search(query)
    .then(data => {
      const book = data.map(filterData).filter(e => e)
      if ( book.length < 1 ) {
        res.status(404).send('not found')
      }
      res.send(book)
    })
    .catch(e => {
      res.status(500).send(e)
    })
},
getById = async (req, res) => {
  try {
    const {googleId} = req.params
    let book = await Books.findOne({googleId})
    if ( !book ) {
      book = filterDetailedData(await api.lookup(googleId))
      if ( !book ) {
        return res.status(404).send('not found')
      }
    }
    return res.send(book)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
},
registerBook = async (req, res) => {
  const ownedBy = req.user.userName
  const {googleId, ...book} = req.body.book
  book.ownedBy.push(ownedBy)
  try {
    const result = await Books.insertOrDelete( { googleId }, { $pull: { ownedBy }, update: { $addToSet: { ownedBy } }, insert: { $set: book } }, { upsert: true } )
    const response = result ? book.ownedBy : book.ownedBy.filter(e => e !== ownedBy)
    res.send({ownedBy: response})
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
},
requestBook = async (req, res) => {
  const requestedBy = req.user.userName
  const {googleId, ...book} = req.body.book
  book.requestedBy.push(requestedBy)
  try {
    const result = await Books.insertOrDelete( { googleId }, { $pull: { requestedBy }, update: { $addToSet: { requestedBy } }, insert: { $set: book } }, { upsert: true } )
    const response = result ? book.requestedBy : book.requestedBy.filter(e => e !== requestedBy)
    res.send({requestedBy: response})
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
},
registeredBooks = async (req, res) => {
  const defaultOptions = {
    limit: 20,
    field: 'title',
    query: false,
    operator: '$eq'
  }
  const {query, ...options} = Object.assign({}, defaultOptions, req.query)
  let where = {}  
  if (query) {
    if(query === 'me') {
      where = { ownedBy: req.user.userName }
    } else if (options.operator === '$like') {
      where = { [options.field]: new RegExp(query) }
    } else {
      where = { [options.field]: { [options.operator]: query } }
    }
  }
  try {
    const books = await Books.find(where, options).toArray()
    res.send(books)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

module.exports = {
  search, getById, registerBook, registeredBooks, requestBook
}