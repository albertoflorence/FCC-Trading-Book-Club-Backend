const jwt = require('jsonwebtoken')
const jwt_config = require('../../config/jwt')

const jwtSignUser = user => {
  const ONE_WEEK = 60 * 60 * 24 * 7
  return jwt.sign(user, jwt_config.secret, {
    expiresIn: ONE_WEEK
  })
}

const handleResult = (res) => (c) => {
  if(!c) return res.status(404).send('email or password incorrect')
  let result = c
  if(c.hasOwnProperty('ops')) result = c.ops[0]
  const user = {
    _id: result._id,
    userName: result.userName,
    email: result.email,
    city: result.city || '',
    state: result.state || ''
  }
  return res.send({
    user,
    token: jwtSignUser(user)
  })
}
const handleError = (res) => (err) => {
  if(!err.status) err.status = 500
  return res.status(err.status).send(err.msg)
}

module.exports = {
  handleResult, handleError
}