const { get, update, destroy } = require('../controllers/notification')
const { isAuthenticated } = require('../controllers/auth')
const notifications = require('express').Router()

notifications.get('/', isAuthenticated, get)
notifications.put('/:id', isAuthenticated, update)
notifications.delete('/:id', isAuthenticated, destroy)

module.exports = notifications