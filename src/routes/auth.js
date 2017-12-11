const { signUp, signIn, getGoogleUrl, signInWithGoogle, signInWithToken } = require('../controllers/auth')
const  auth = require('express').Router()

auth.post('/signup', signUp)
auth.post('/signin', signIn)
auth.get('/url/google', getGoogleUrl)
auth.post('/signin/google', signInWithGoogle)
auth.post('/signin/token', signInWithToken)

module.exports = auth