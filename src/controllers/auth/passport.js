const passport = require('passport')
const {Strategy, ExtractJwt} = require('passport-jwt')
const jwt_config = require('../../../config/jwt')
const {ObjectId} = require('mongodb')

module.exports = (Users) => {
  passport.use(new Strategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwt_config.secret
  },  (payload, done) => {
    Users.findOne({ _id: ObjectId(payload._id)}, payload)
      .then(user => {
        if(!user) {
          return done(null, false)
        }
        return done(null, user)
      })
      .catch(err => done(err, false))
  }))
}