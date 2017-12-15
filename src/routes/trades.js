const { create, getOne, get, answer } = require('../controllers/trade')
const { isAuthenticated } = require('../controllers/auth')
const  trades = require('express').Router()

trades.post('/', isAuthenticated, create)
trades.post('/answer/:id', isAuthenticated, answer)
trades.get('/', isAuthenticated, get)
trades.get('/:id', isAuthenticated, getOne)

module.exports = trades
  