import { db } from './index'

const counter = db.counter

export function add(key) {
  return new Promise((resolve, reject) => {
    const options = { returnUpdatedDocs: true, upsert: true }
    counter.update({key: key}, {$inc: {count: 1}}, options, function (err, numReplaced, upsert) {
      if (err) {
        reject(err)
        return
      }
      resolve(upsert)
    })
  })
}

export function query(key) {
  return new Promise((resolve, reject) => {
    counter.findOne({key: key}, function (err, doc) {
      if (err) {
        reject(err)
        return
      }
      resolve(doc)
    })
  })
}

export function list() {
  return new Promise((resolve, reject) => {
    counter.find({}, function (err, docs) {
      if (err) {
        reject(err)
        return
      }
      resolve(docs)
    })
  })
}
