module.exports = (Model) => {
  Model.props = {
    user: {},
    userTarget: {},
    bookId: {},
    bookIdTarget: {},
    status: {},
  }
  return Model
}