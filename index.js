require('dotenv').config()
require('./config/server/mongodb')()
  .then(db => {
    const server = require('./config/server')
    const PORT = process.env.PORT || 8000
    server.listen(PORT, () => console.log(`Server listening at port: ${PORT} `))
})

