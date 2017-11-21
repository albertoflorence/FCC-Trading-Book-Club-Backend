require('dotenv').config()
const configureServer = require('./config/server')
const server = configureServer()

const PORT = process.env.PORT || 8000
server.listen(PORT, () => {
  console.log(`Server listening at port: ${PORT} `)
})
