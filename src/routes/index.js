module.exports = (app) => {
  
  require('./pre')(app)
  app.use('/auth', require('./auth'))
  app.use('/users', require('./users'))
  app.use('/books', require('./books'))
  app.use('/trades', require('./trades'))
  app.use('/notifications', require('./notifications'))  
}