module.exports = (Model) => {
  const data = (receiver, sender, type) => {
    return ({
      receiver: receiver,
      sender: sender.user || sender,
      type,
      seen: false,
      createdAt: new Date().getTime()
    })
  }
  const create = async ({sender, receivers, receiver, type}) => {
    if ((!receivers || receivers.length < 1) && !receiver) return
    let notificationsData
    if (receiver) {
      notificationsData = data(receiver, sender, type)
    } else {
      notificationsData = receivers.map(r => data(r, sender, type))
    }
    return await Model.insert(notificationsData)
  }
  Model.create = create
  return Model
}