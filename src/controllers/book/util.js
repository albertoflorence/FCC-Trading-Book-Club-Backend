const {Books} = require('../../models')

const reverse = (type) => {
  switch (type) {
    case 'request':
      return 'register'
    case 'register':
      return 'request'
    case 'ownedBy':
     return 'requestedBy'
    case 'requestedBy':
      return 'ownedBy'
    default:
      return new Error(type + "can't be reversed")
  }    
}

const getType = async (bookId, user) => {
  const book = await Books.findOne({bookId}, {ownedBy: 1, requestedBy: 1})
  if (!book) return null
  let type = null
  if (book['ownedBy']) {
    if (book['ownedBy'].includes(user)) {
      type = 'ownedBy'
    } else if (book['requestedBy']) {
      if (book['requestedBy'].includes(user)) {
        type = 'requestedBy'
      }
    }
  } else {
    return null
  }
  return { type, book }
}

module.exports = {
  getType, reverse
}