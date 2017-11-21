const gapi = require('googleapis')
const {OAuth2} = gapi.auth

const {clientID, clientSecret, callbackURL} = require('../../config/google')

const oauth2Client = new OAuth2(
  clientID,
  clientSecret,
  callbackURL
)

const scopes = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/userinfo.email'
]

const getUrl = () => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
  })
  return url
}
const getUser = (code, Users) => {
  return new Promise((resolve, reject) => {
      oauth2Client.getToken(code, (err, tokens) => {
      if(err) return reject(err)
      oauth2Client.setCredentials(tokens)
      const plus = gapi.plus('v1')
      plus.people.get({
        userId: 'me',
        auth: oauth2Client
      }, (err, googleUser) => {
        if (err) reject(err)
        const email = googleUser.emails[0].value
        const userName = googleUser.name.givenName + googleUser.name.familyName 
        resolve({email, userName})
      }) 
    })})
    .then(async ({email, userName}) => {
      const dbUser = await Users.findOne({email})
      if(!dbUser) {
        return Users.insertOne({email, userName})     
      }
      return dbUser
    })
}

module.exports = { getUrl, getUser }

