module.exports = (Model) => {
  Model.props = {
    userName: {
      validate: {
        unique: true,
        len: [4, 36]
      }
    },
    email: {
      validate: {
        unique: true,
        type: 'email'
      }
    },
    password: {
      validate: {
        len: [8, 32],
        type: 'password'
      },
      modify: {
        crypt: true
      }
    },
    city: {
    },
    state: {
    }
  }

  Model.checkPassword = ({password, email}) => 
    Model.check({password}, 'find')
      .then(r => Model.findOne({email, password: r.password}))
      .then(r => r ? null : Promise.reject({msg: 'Please check the password', status: 400}))
  

  return Model
}