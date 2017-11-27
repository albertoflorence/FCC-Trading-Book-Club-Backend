const { search, getById, registerBook, registeredBooks, requestBook } = require('../controllers/book')
const { isAuthenticated } = require('../controllers/auth')

module.exports = app => {
  app.get('/books/search', search)
  app.post('/books/register', isAuthenticated, registerBook)
  app.post('/books/request', isAuthenticated, requestBook)
  app.get('/books/fetch/', registeredBooks)
  app.get('/books/:googleId', getById)
}