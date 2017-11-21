module.exports = (Models) => {
  const user = require('./user')(Models)
  const auth = require('./auth')(Models)
  return {
    user,
    auth
  }
}