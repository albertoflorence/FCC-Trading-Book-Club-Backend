const Promise = require('bluebird')
types = {
  email: (data, name) => {
    return /^[0-9a-zA-Z\.\-\_]+\@[0-9a-zA-Z\-]+(\.[A-Za-z]+){1,2}$/.test(data) 
    ? null
    : {
      msg: `You must provide a valid ${name} address`,
      status: 422
    } 
  },
  password: (data, name) => {
    let msg = ''
    if(!/[a-z]/.test(data)) {
      msg = `The ${name} must contain at least one lower case character.`
    } else if (!/[A-Z]/.test(data)) {
      msg = `The ${name} must contain at least one upper case character`
    } else if (!/[^a-zA-Z]/.test(data)) {
      msg = `The ${name} must contain at least one numeric or special character`
    } else {
      return null
    }
    return {
      msg,
      status: 422
    }
  }
}

module.exports = ({prop, data, name}) =>
  new Promise((resolve, reject) => {
    const error = types[prop](data, name)
    return error ? reject(error) : resolve()
  })

