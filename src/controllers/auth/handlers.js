const jwt = require('jsonwebtoken')
const jwt_config = require('../../../config/jwt')
const {ObjectId} = require('mongodb')
const {Users} = require('../../models')

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
const handleError = (res) => (error) => {
  const {status=500, msg, ...err} = error
  return res.status(status).send(msg || err)
}

const verifyToken = async (token) => {
  try {
    const {_id} = await jwt.verify(token, jwt_config.secret)
    const user = await Users.findOne({_id: ObjectId(_id)})
    if (!user) {
      return Promise.reject({
        msg: 'user not found',
        status: 404
      })
    }
    return user
  } catch (err) {
    return Promise.reject(err)
  }
}
module.exports = {
  handleResult, handleError, verifyToken
}