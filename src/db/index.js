import mongoose from 'mongoose'
import secret from '../../secret'
import * as debug from '../lib/debug'

// http://mongoosejs.com/docs/promises.html
mongoose.Promise = global.Promise

let host = secret.database.host
let port = secret.database.port
let name = secret.database.name

new Promise((resolve, reject) => {
  mongoose.connect(`mongodb://${host}:${port}/${name}`, {
    useMongoClient: true
  }, (err) => {
    if (err) {
      reject(err)
      return
    }
    resolve()
  })
}).then(() => {
  debug.log('Success to connect to MongoDB')
}).catch((err) => {
  debug.error('Failed to connect to MongoDB at ', `mongodb://${host}:${port}/${name}`)
  debug.error(err)
})
