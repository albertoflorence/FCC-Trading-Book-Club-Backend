const email = ({password, newEmail}, {email}, Users) => {
  return Users.checkPassword({email, password})
    .then(() => Users.check({email: newEmail}, 'update'))
    .then(r => Users.updateOne({email}, {$set: {email: newEmail}}))
    .then(() => ({
      msg: "Email changed sucessfully",
      data: { 
        property: 'email',
        data: newEmail
       }
    }))

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

const city = (data, {email}, Users) => {
  return Users.updateOne({email}, {$set: {city: data}})
    .then(() => ({
      msg: 'City changed successfully',
      data: {
        property: 'city',
        data
      }
    }))
}

const state = (data, {email}, Users) => {
  return Users.updateOne({email}, {$set: {state: data}})
    .then(() => ({
      msg: 'State changed successfully',
      data: {
        property: 'state',
        data
      }
    }))
}

module.exports = {
  email, password, city, state
}