const { get, getOne, create, register, matchUsers, matchBooks } = require('../controllers/book')
const { isAuthenticated } = require('../controllers/auth')
const  books = require('express').Router()

books.get('/', get)
books.post('/register', isAuthenticated, create, register)
books.get('/match/users/:bookId', isAuthenticated, matchUsers)
books.get('/match/books/:target', isAuthenticated, matchBooks)
books.get('/:bookId', getOne)

module.exports = books