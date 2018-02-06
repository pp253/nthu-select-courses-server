import mongoose from 'mongoose'
import '../'
import constant from './constant'

const LogSchema = new mongoose.Schema(
  {
    time: '',
    ip: ''
  }
)

AccountsSchema.statics = {
}

mongoose.model('Accounts', AccountsSchema)

export default mongoose.model('Accounts')
