const email = ({password, newEmail}, {email}, Users) => {
  return Users.checkPassword({email, password})
    .then(() => Users.check({email: newEmail}, 'update'))
    .then(r => Users.updateOne({email}, {$set: {email: newEmail}}))
    .then(() => ({msg: "Email changed sucessfully"}))

}
const password = ({confirmPassword, password, newPassword }, {email}, Users ) => {
  if (newPassword !== confirmPassword) {
    return Promise.reject(`The confirm password doesn't the match the new password`)
  }
  return Users.checkPassword({email, password})
    .then(() => Users.check({password: newPassword}, 'update'))
    .then(r => Users.updateOne({email}, {$set: {password: r.password}}))
    .then(() => ({msg: "Password changed successfully"}))
}

const userName = () => {

}

const city = (data, {email}, Users) => {
  return Users.updateOne({email}, {$set: {city: data}})
}

const state = () => {
  
}

module.exports = {
  email, password, userName, city, state
}