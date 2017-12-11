const { create, getOne, get } = require('../controllers/trade')
const { isAuthenticated } = require('../controllers/auth')
const  trades = require('express').Router()

trades.post('/', isAuthenticated, create)
trades.get('/', isAuthenticated, get)
trades.get('/:id', isAuthenticated, getOne)

module.exports = trades
  