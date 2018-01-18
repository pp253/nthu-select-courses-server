import rq from 'request-promise-native'
import iconv from 'iconv-lite'
import { Exception } from './debug'

export function request (...argu) {
  return rq(...argu)
}

export function correctRequest (argu) {
  return new Promise((resolve, reject) => {
    if (typeof argu !== 'object') {
      reject(new Exception('correctRequest: argu should be an object.'))
    }

    argu.encoding = null

    request(argu)
    .then(function (body) {
      resolve(iconv.decode(body, 'big5'))
    })
    .catch(function (err) {
      reject(err)
    })
  })
}
