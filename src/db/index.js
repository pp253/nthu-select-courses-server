import Datastore from 'nedb'
import * as counter from './counter'

export const db = {
  counter: new Datastore({
    filename: 'db/counter',
    autoload: true
  })
}

const updateInerval = 10 * 60 * 1000
db.counter.persistence.setAutocompactionInterval(updateInerval)

export default {
  db,
  counter
}

