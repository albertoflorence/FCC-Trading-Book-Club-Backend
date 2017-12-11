const express = require('express')
const configureMongoDb = require('./mongodb')
const bodyParser = require('body-parser')
const passport = require('passport')


const app = express()
app.use(bodyParser.json())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH')
  res.header('Access-Control-Allow-Origin', process.env.FRONT_END_URL)
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  next()
});

app.use((req, res, next) => {
  passport.authenticate('jwt', (err, user) => {
    if(!err && user) {
      req.user = user
    }
    return next()
  })(req, res, next)
})

require('../../src/routes')(app)

app.use((error, req, res, next) => {
  console.log('-------- ERROR --------')
  console.log(error)
  console.log('-----------------------')
  if (!error) {
    error = { 
      message: 'Something bad happened', 
      status: 500 
    }
  }
  res.status(error.status || 500)
  res.send(error)
})

module.exports = app
