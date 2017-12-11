const funcs = { 
  unique: require('./unique'),
  type: require('./type'),
  len: require('./len')
}

module.exports = ({props, data, model, name}) => {
  if(!props) return Promise.resolve(data)
  const propsName = Object.keys(props)
  return Promise.all(propsName.map(prop => 
      funcs[prop]({
      prop: props[prop],
      data,
      model,
      name,
    })
  )).then(d => {
    const value = d.find(e => e)
    return value ? value : data
  })
}