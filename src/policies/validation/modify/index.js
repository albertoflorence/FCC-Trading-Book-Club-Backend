const funcs = {
  crypt: require('./crypt')
}
module.exports = ({props, data}) => {
  if(!props) return data
  const propsName = Object.keys(props)
  return propsName.reduce((prevData, prop) =>funcs[prop](prevData), data)  
}
