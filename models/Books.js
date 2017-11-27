module.exports = (Model) => {

  Model.insertOrDelete = async (where, data, options={}) => {
    const {$pull, insert, update} = data
    try {
      const book = await Model.update(
        where,
        { $pull },
        { multi: false, upsert: false })
      if (book.result.nModified === 0) {
        if (book.result.n === 0) {
          action = insert
        } else {
          action = update
        }
        await Model.update(where, action, options)
        return true
      } else {
        return false
      }
    } catch (err) {
      return err
    }
  }

  return Model
}