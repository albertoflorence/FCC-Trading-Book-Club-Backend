const config = require('../../config/mongodb-config')
const fs = require('fs')
const path = require('path')
const mongodb = require('mongodb')
const client = mongodb.MongoClient()
const check = require('../policies/validation')
const db = {}

const connect = () => {
  return new Promise((resolve, reject) => {
    client.connect(config.uri, (err, connection) => {
      if (err) return reject(err)
      fs.readdirSync(__dirname)
        .filter(file => file !== 'index.js')
        .forEach(file => {
          const fileName = file.replace(/\..+/,'')
          const model = require('./' + file)
          const collection = model(connection.collection(fileName))
          collection.check = check
          db[fileName] = collection
        })
      return resolve(db)
    })
  })
} 

db.connect = connect

module.exports = db
