module.exports = (res) => (err) => {
  if(!err.status) err.status = 500
  return res.status(err.status).send(err.msg)
}