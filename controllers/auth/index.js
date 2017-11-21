const {handleError, handleResult} = require('./handlers')
const googleAuth = require('./googleAuth')
const passport = require('passport')


module.exports = ({Users}) => {
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
  isAuthenticated = (req, res, next) => {
    passport.authenticate('jwt', (err, user) => {
      if(err || !user) {
        return res.status(401).send({msg: 'unauthenticated user'})
      }
      req.user = user
      return next()
    })(req, res, next)
  }
  
  return {
    signUp, signIn, signInWithGoogle, isAuthenticated, getGoogleUrl
  }
}