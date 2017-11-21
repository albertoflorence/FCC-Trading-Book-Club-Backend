module.exports = (app) => {
  const { signUp, signIn, getGoogleUrl, signInWithGoogle } = app.controllers.auth
  app.post('/auth/signup', signUp)
  app.post('/auth/signin', signIn)
  app.get('/auth/url/google', getGoogleUrl)
  app.post('/auth/signin/google', signInWithGoogle)
}