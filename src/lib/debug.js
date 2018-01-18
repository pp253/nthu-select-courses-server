import moment from 'moment'

export function time () {
  return moment().format('MM-DD HH:mm:ss')
}

export function log (...msg) {
  console.log(time() + ' ' + msg.shift(), ...msg)
}

export function error (...msg) {
  console.error(time() + ' ' + msg.shift(), ...msg)
}

export function info (...msg) {
  console.info(time() + ' ' + msg.shift(), ...msg)
}

export function debug (...msg) {
  console.debug(time() + ' ' + msg.shift(), ...msg)
}

export class Exception {
  constructor (id, msg, syserr) {
    this.error = 1
    switch (typeof id) {
      case 'object':
        this.id = id.id
        this.msg = id.msg
        this.syserr = id.syserr
        break
      case 'number':
        this.id = id
        this.msg = msg
        this.syserr = syserr
        break
      case 'string':
        this.id = 0
        this.msg = id
        this.syserr = null
        break
    }
  }

  toJSON () {
    return JSON.stringify({
      error: 1,
      id: this.id,
      msg: this.msg
    })
  }
}

const ExceptionMsg = {

}

export default {
  time: time,
  log: log,
  error: error,
  info: info,
  debug: debug,
  Exception: Exception
}
