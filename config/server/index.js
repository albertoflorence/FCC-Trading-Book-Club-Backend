const express = require('express')
const configureMongoDb = require('./mongodb')
const routes = require('../../routes')
const controllers = require('../../controllers')
const bodyParser = require('body-parser')


const app = express()
app.use(bodyParser.json())
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', process.env.FRONT_END_URL)
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
  next();
});

module.exports = () => {
  configureMongoDb()
  .then((Models) => {
    app.controllers = controllers(Models)
    routes(app)
  })
  return app
}
