const Models = require('../models')

const findOperator = (ops, string) => {
  return ops.find(op => string.startsWith(op))
}

const projectify = (fields, include=1) => {
  return typeof(fields) === 'string' ? Object.assign({}, ...fields.replace(/\s/g, '').split(',').map(name => ({[name]: include}))) : {}
}

const extractModelFromPath = (path) => {
  const arr = path.split('/').filter(e => e)
  let root, child
  root = arr[0].replace(/^./,e => e[0].toUpperCase())
  if ( arr.length > 1 ) {
    child = arr.slice(-1)[0].replace(/^./,e => e[0].toUpperCase())
  }
  return {
    root: Models[root],
    child: Models[child]
  }
}

const operatorizy = (field) => {
  const ops = ['$like', '$eq', '$gt', '$gte', '$lt', '$lte']
  const arrOps = ['$in', '$ne', '$nin']
  const operator = findOperator(ops, field)
  const arrOperator = findOperator(arrOps, field)

  if (operator) {
    if (operator === '$like') {
      return { '$regex': new RegExp(field.slice(operator.length + 1).trim(), 'i') }
    }
    return { [operator]: field.slice(operator.length + 1).trim() }
  } else if (arrOperator) {
    return { [arrOperator]: field.slice(arrOperator.length + 1).replace(/\s/g, '').split(',') }
  }
  return field
}

const getValidPropertys = async (data, type, path) => {  
  const {root, child} = extractModelFromPath(path)
  if ( child ) {
    return await child.check(data, type)
  } else if ( root ) {
    return root.check(data, type)
  }
}

const GET = async (req, res, next) => {
  try {
    const {query} = req
    if (query) {
      const {fields, embedFields, q, ...rest} = query
      let filter = await getValidPropertys(rest, 'find', req.path)
      if (filter) {
        filter = Object.assign({}, ...Object.keys(filter).map(e => ({[e]: operatorizy(filter[e])})))
      } else {
        filter = {}
      }
      req.query = {}
      req.query.filter = filter
      req.query.q = q
      req.query.fields = projectify(fields)
      req.query.embedFields = projectify(embedFields)
    }
    next()
  } catch (err) {
    console.log(err)
  }
}

const POST = async (req, res, next) => {
  next()
}
const PUT = (req, res, next) => {
  next()
} 
const PATCH = (req, res, next) => {
  next()  
}
const DELETE = (req, res, next) => {
  next()
}
module.exports = (app) => {
  app.use((req, res, next) => {
    switch ( req.method ) {
      case 'GET':
        return GET(req, res, next)
    //   case 'POST':
    //     return POST(req, res, next)
    //   case 'PUT':
    //     return PUT(req, res, next)
    //   case 'PATCH':
    //     return PATCH(req, res, next)
    //   case 'DELETE':
    //     return DELETE(req, res, next)
    }
    next()
  })
}