module.exports = (res) => (err) => {
  console.log(err)
  return res.status(err.status || 500).send(err.msg || err)
}