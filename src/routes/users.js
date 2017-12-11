const users = require('express').Router()
const { updateUser } = require('../controllers/user')
const { isAuthenticated } = require('../controllers/auth')
users.put('/', isAuthenticated, updateUser)

module.exports = users