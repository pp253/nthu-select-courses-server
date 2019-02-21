import process from 'process'
import moment from 'moment'
import { Exception } from './debug'

/**
 * Using `set NODE_ENV=development` or `set NODE_ENV=production` for
 * determining the environment.
 */
export const PRODUCTION = process.env.NODE_ENV === 'production'
console.log(`process.env.NODE_ENV`,process.env.ASDASD)
export function toArray (obj) {
  if (typeof obj !== 'object') {
    throw new Exception('toArray: obj should be an object.')
  }

  let arr = []
  for (let key in obj) {
    arr.push(obj[key])
  }
  return arr
}

/**
 * Formatting a string by the arguments.
 *
 * Example:
 * format('{0}: {1}', 123, 456) // replace by arguments' index
 *   -> 123: 456
 * format('{0:456}') // assign the default value
 *   -> 456
 * format('{name}: {value}', {name: 123, value: 456}) // assign the value by key
 *   -> 123: 456
 *
 * @param {String} str String to formatted.
 * @param {Object | String[]} argus Arguments for formatting.
 */
export function format (str, ...argus) {
  if (typeof str !== 'string') {
    throw Exception('format: str should be a string.')
  }

  let result = str
  const reg = /\{([^}:]*)(?::([^}]*))?\}/
  let isObj = argus[0] && typeof argus[0] === 'object'

  while (true) {
    const exec = reg.exec(result)
    if (!exec) {
      break
    }
    const key = exec[1]
    const index = exec.index
    const length =
      key.length + 2 + (exec[2] === undefined ? 0 : exec[2].length + 1)
    const text = (isObj ? argus[0][key] : argus[key]) || exec[2] || ''
    result = result.slice(0, index) + text + result.slice(index + length)
  }
  return result
}

export class Timer {
  constructor (name, log) {
    this.history = []
    this.laps = []
    this.counting = false
    this.name = name || `timer(${Date.now()})`
    this.log = log || !PRODUCTION
    this._duration = 0
    return this
  }

  resume () {
    if (!this.counting) {
      const t = Date.now()
      const c = this.count()
      this.history.push({
        time: t,
        count: c
      })
      this.counting = true
      if (this.log) {
        console.log(
          `${this.name} | RESUME: ${moment(t).format(
            'MM-DD HH:mm:ss:SSS'
          )} ${c}ms`
        )
      }
    }
    return this
  }

  pause () {
    if (this.counting) {
      const t = Date.now()
      const c = this.count()
      this.history.push({
        time: t,
        count: c
      })
      this.counting = false
      this._duration = c - this._duration
      if (this.log) {
        console.log(
          `${this.name} | PAUSE:  ${moment(t).format(
            'MM-DD HH:mm:ss:SSS'
          )} ${c}ms`
        )
      }
    }
    return this
  }

  start () {
    this.resume()
    return this
  }

  stop () {
    this.pause()
    return this
  }

  lap () {
    const t = Date.now()
    const c = this.count()
    this.laps.push({
      time: t,
      count: c
    })
    if (this.log) {
      console.log(
        `${this.name} | LAP:    ${moment(t).format(
          'MM-DD HH:mm:ss:SSS'
        )} ${c}ms`
      )
    }
    return this
  }

  reset () {
    this.history = []
    this.laps = []
    this._duration = 0
    this.counting = false
    this.log = false
    return this
  }

  count () {
    if (this.counting) {
      const lastLog = this.history[this.history.length - 1]
      return Date.now() - lastLog.time + this._duration
    } else {
      return this._duration
    }
  }

  toString () {
    let str = ''
    return str
  }
}
