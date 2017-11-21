const validate = require('./validate')
const modify = require('./modify')

const handleFind = (props, data, model) => {
  dataProps = Object.keys(data)
  propsNames = Object.keys(props).filter(d => dataProps.includes(d))
  return Promise.all(propsNames.map(prop =>({
    [prop]: modify({
    props: props[prop]['modify'],
    data: data[prop],
    model,
    name: prop
    }
  )}))).then(c => Object.assign({}, ...c))
}
const handleUpdate = (props, data, model) => {
  dataProps = Object.keys(data)
  propsNames = Object.keys(props).filter(d => dataProps.includes(d))
  return handleInsert(props, data, model, propsNames)
}

const handleInsert = (props, data, model, propsNames) => {
  if(!propsNames) propsNames = Object.keys(props)
  return Promise.all(propsNames.map(prop => {  
    const types = props[prop]
      return validate({
      props: types['validate'],
      data: data[prop],
      model,
      name: prop
      }).then(validData => {
        return {
          [prop]: modify({
          props: types['modify'],
          data: validData,
          model,
          name: prop
        })}
      })
    })).then(c => Object.assign({}, ...c))
}

module.exports = function (data, test) {
  const props = [this.props, data, this]
  let res = null
  switch(test) {
    case 'find':
      return handleFind(...props)
      break;
    case 'update':
      return handleUpdate(...props)
      break;
    case 'insert':
      return handleInsert(...props)
      break;
  }
}
