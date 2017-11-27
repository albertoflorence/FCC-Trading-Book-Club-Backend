const { signUp, signIn, getGoogleUrl, signInWithGoogle } = require('../controllers/auth')

module.exports = (app) => {
  app.post('/auth/signup', signUp)
  app.post('/auth/signin', signIn)
  app.get('/auth/url/google', getGoogleUrl)
  app.post('/auth/signin/google', signInWithGoogle)
}