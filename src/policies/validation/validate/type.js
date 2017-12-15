const Promise = require('bluebird')
types = {
  email: (data, name) => {
    return /^[0-9a-zA-Z\.\-\_]{4,64}\@[0-9a-zA-Z\-]{4,255}(\.[A-Za-z]+){1,2}$/.test(data) 
    ? null
    : {
      message: `You must provide a valid ${name} address`,
      status: 422
    } 
  },
  password: (data, name) => {
    let message = ''
    if(!/[a-z]/.test(data)) {
      message = `The ${name} must contain at least one lower case character.`
    } else if (!/[A-Z]/.test(data)) {
      message = `The ${name} must contain at least one upper case character`
    } else if (!/[^a-zA-Z]/.test(data)) {
      message = `The ${name} must contain at least one numeric or special character`
    } else {
      return null
    }
    return {
      message,
      status: 422
    }
  }
}

module.exports = ({prop, data, name}) =>
  new Promise((resolve, reject) => {
    const error = types[prop](data, name)
    return error ? reject(error) : resolve()
  })

