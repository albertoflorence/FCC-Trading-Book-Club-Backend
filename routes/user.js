  const { updateUser } = require('../controllers/user')
  const { isAuthenticated } = require('../controllers/auth')

module.exports = (app) => {
  app.put('/user', isAuthenticated, updateUser)
}