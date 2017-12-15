const Promise = require('bluebird') 
const api = require('google-books-search')
api.search = Promise.promisify(api.search)
api.lookup = Promise.promisify(api.lookup)

const filterData = data => {
  const { title, authors, thumbnail, publisher, description, id, publishedDate } = data
  if (title && authors && thumbnail && publisher && description && id && publishedDate) {
    return {
      title, 
      author: authors[0],
      thumbnail,
      publisher,
      description: description.slice(0, 280),
      bookId: id,
      publishedYear: publishedDate.length > 4 ? publishedDate.slice(0,4) : publishedDate,
    }
  }
  return null
}

const filterDetailedData = data => {
  const { title, authors, thumbnail, publisher, description, id, publishedDate } = data
  if (title && authors && thumbnail && publisher && description && id && publishedDate) {
    return {
      title, 
      author: authors[0],
      thumbnail,
      publisher,
      description: description.replace(/\s{2}/g, ''),
      bookId: id,
      publishedDate,
      publishedYear: publishedDate.length > 4 ? publishedDate.slice(0,4) : publishedDate,
      url_image: data.images.small
    }
  }
  return null
}

const search = async (query) => {
  const books = await api.search(query).then(data => data.map(filterData).filter(e => e) )
  if ( books.length < 1 ) {
    return Promise.reject({status: 404, message: 'book not found'})
  }
  return books
}
const getById = async (id) => {
  const book = await api.lookup(id).then(filterDetailedData)
  if ( !book ) {
    return Promise.reject({status: 404, message: 'book not found'})
  }
  return book
}

module.exports = {
  search, getById
}