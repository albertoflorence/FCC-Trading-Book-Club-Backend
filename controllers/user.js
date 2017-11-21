const handleErrors = require('../handlers/handleErrors')
module.exports = ({Users}) => {
  const getByName = (req, res) => {
    const { name } = req.params
    Users.findOne({user: name})
      .then(result => res.send(result))
      .catch(err => res.status(404).send())
  },
  changePassword = (req, res) => {
    const { confirmPassword, password, newPassword } = req.body
    const {email} = req.user
    if (newPassword !== confirmPassword) {
      return res.status(400).send(`The confirm password doesn't the match the new password`)
    }
    Users.checkPassword({email, password})
      .then(() => Users.check({password: newPassword}, 'update'))
      .then(r => Users.updateOne({email}, {$set: {password: r.password}}))
      .then(r => res.send({msg: "Password changed successfully"}))
      .catch(handleErrors(res))
  },
  changeEmail = (req, res) => {
    const {password, newEmail} = req.body
    const {email} = req.user
    Users.checkPassword({email, password})
      .then(() => Users.check({email: newEmail}, 'update'))
      .then(r => Users.updateOne({email}, {$set: {email: newEmail}}))
      .then(() => res.send({msg: "Email changed sucessfully"}))
      .catch(handleErrors(res))
  }
  return {
    getByName, changePassword, changeEmail
  }
}


