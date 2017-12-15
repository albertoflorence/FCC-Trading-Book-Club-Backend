const messageError = (data, len, name) => {
  let message = ''
  let [min, max] = len
  if(!data && min > 0) message = `The ${name} is required `
  else if (data.length < min ) message = `The ${name} has to have at least ${min} character in length`
  else if (data.length > max ) message = `The ${name} cannot be greater than ${max} character in length`
  else return null
  return {
    message,
    status: 422
  }
}
module.exports = ({prop, data, name}) => 
  new Promise((resolve, reject) => {
    const error = messageError(data, prop, name)
    if(error) return reject(error)
    return resolve()
  })
