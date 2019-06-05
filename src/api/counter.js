import response from './response'
import * as counter from '../db/counter'

export function query(key) {
  return new Promise((resolve, reject) => {
    counter.query(key)
      .then(doc => {
        if (doc === null) {
          resolve(
            response.ResponseSuccessJSON({
              key: key,
              count: 0
            })
          )
        } else {
          resolve(
            response.ResponseSuccessJSON({
              key: doc.key,
              count: doc.count
            })
          )
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}

export function list() {
  return new Promise((resolve, reject) => {
    counter.list()
      .then(docs => {
        resolve(
          response.ResponseSuccessJSON({
            list: docs
          })
        )
      })
      .catch(err => {
        reject(err)
      })
  })
}
