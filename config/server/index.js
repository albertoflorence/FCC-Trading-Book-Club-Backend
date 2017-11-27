const express = require('express')
const configureMongoDb = require('./mongodb')
const routes = require('../../routes')
const controllers = require('../../controllers')
const bodyParser = require('body-parser')
const passport = require('passport')


const app = express()
app.use(bodyParser.json())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.FRONT_END_URL)
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
  next();
});
app.use((req, res, next) => {
  passport.authenticate('jwt', (err, user) => {
    if(!err && user) {
      req.user = user
    }
    return next()
  })(req, res, next)
})


require('../../routes')(app)

module.exports = app
