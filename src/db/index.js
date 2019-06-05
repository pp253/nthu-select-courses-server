import Datastore from 'nedb'
import * as counter from './counter'

export const db = {
  counter: new Datastore({
    filename: 'db/counter',
    autoload: true
  })
}

export default {
  db,
  counter
}

