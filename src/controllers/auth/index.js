const {handleError, handleResult, verifyToken} = require('./handlers')
const googleAuth = require('./googleAuth')
const passport = require('passport')
const {Users} = require('../../models')
require('./passport')(Users)  


const signUp = (req, res) => {
  Users.check(req.body, 'insert')
    .then(data => Users.insertOne(data))
    .then(handleResult(res))
    .catch(handleError(res))
},
signIn = (req, res) => {
  Users.check(req.body, 'find')
    .then(r => Users.findOne({email: r.email, password: r.password}))
    .then(handleResult(res))
    .catch(handleError(res))
},
getGoogleUrl = (req, res, next) => {
  res.send(googleAuth.getUrl())
},
signInWithGoogle = (req, res) => {
  const {code} = req.body
  googleAuth.getUser(code, Users)
    .then(handleResult(res))
    .catch(handleError(res))
},
signInWithToken = async (req, res) => {
  const {token} = req.body
  try {
    handleResult(res)(await verifyToken(token))
  } catch (err) {
    console.log(err)
    handleError(res)(err)
  }
},
isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({msg: 'unauthenticated user'})
  }
  return next()
}

module.exports = {
  signUp, signIn, signInWithGoogle, isAuthenticated, getGoogleUrl, signInWithToken
}