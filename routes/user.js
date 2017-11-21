module.exports = (app) => {
  const { changePassword, changeEmail } = app.controllers.user
  const { isAuthenticated } = app.controllers.auth
  app.put('/user/changePassword', isAuthenticated, changePassword)
  app.put('/user/changeEmail', isAuthenticated, changeEmail)
}