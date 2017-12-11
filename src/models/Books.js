module.exports = (Model) => {
  Model.props = {
    bookId: {},
    title: {},
    author: {},
    thumbnail: {},
    publisher: {},
    description: {},
    publishedDate: {},
    publishedYear: {},
    url_image: {},
    ownedBy: {},
    requestedBy: {},
    ownedByCount: {},
    requestedByCount: {}
  }

  Model.toogleAndCount = async (upVote, downVote, filter, data) => {
    const upCount = upVote + 'Count'
    const downCount = downVote + 'Count'
    const {result} = await Model.update(
      filter, 
      {$pull: {[upVote]: data}}
    )
    const modified = !!result.nModified
    if (modified) {
      const {value} = await Model.findOneAndUpdate(
        filter, 
        {
          $inc: {[upCount]: -1}
        },
        {returnOriginal: false}
      )
      return { value, op: 'deleted'}
    } else {
      const value1 = await Model.findOneAndUpdate(
        filter, 
        {$push: {[upVote]: data}, $inc: {[upCount]: 1}},
        {returnOriginal: false, upsert: true})
        const value2 = await Model.findOneAndUpdate(
          {...filter, [downVote]:  data}, 
          {$pull: {[downVote]: data}, $inc: {[downCount]: -1}},
          {returnOriginal: false, upsert: false})
      if(value2.value) {
        return { value: value2.value, op: 'inserted' }
      } else {
        return { value: value1.value, op: 'inserted' }
      }
    }
  }
  return Model
}