const msgError = (data, len, name) => {
  let msg = ''
  let [min, max] = len
  if(!data && min > 0) msg = `The ${name} is required `
  else if (data.length < min ) msg = `The ${name} has to have at least ${min} character in length`
  else if (data.length > max ) msg = `The ${name} cannot be greater than ${max} character in length`
  else return null
  return {
    msg,
    status: 422
  }
}
module.exports = ({prop, data, name}) => 
  new Promise((resolve, reject) => {
    const error = msgError(data, prop, name)
    if(error) return reject(error)
    return resolve()
  })
