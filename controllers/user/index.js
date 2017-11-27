const {Users} = require('../../models')
const handleErrors = require('../../handlers/handleErrors')
const update = require('./update')

const getByName = (req, res) => {
  const { name } = req.params
  Users.findOne({user: name})
  .then(result => res.send(result))
  .catch(err => res.status(404).send())
},
updateUser = async (req, res) => {
  const {property, data} = req.body
  update[property](data, req.user, Users)
  .then(r => res.send(r))
  .catch(handleErrors(res))
}

module.exports = {
  getByName, updateUser
}
  


