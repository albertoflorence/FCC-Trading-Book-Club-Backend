const map = (obj, cb) => {
  if(!obj) return undefined
  const arr = []
  for(key in obj) {
    arr.push(cb(obj[key], key))
  }
  return arr
}

module.exports = {
  map
}