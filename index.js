import express from 'express'
import session from 'express-session'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import expressValidator from 'express-validator'
import compression from 'compression'
import debug from './src/lib/debug'
import routes from './routes'
import cors from 'cors'

const app = express()

// Security
app.use(helmet())

// Allowing CORS
app.use(cors())

// Compression
app.use(compression({credentials: true, origin: true}))

// Body parser and Validator
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(expressValidator({
  customValidators: {}
}))

// Views
app.set('view engine', 'pug')
app.set('views', './views')

// Session
app.use(session({
  secret: 'ieem-game',
  resave: false,
  saveUninitialized: false
}))

// Setting
app.set('port', process.env.PORT || 80)
app.set('title', 'NTHU SELECT COURSES')

if (process.env.NODE_ENV !== 'production') {
  // app.use('/test', express.static('test'))

  app.use(function (req, res, next) {
    // debug.log(req.connection.remoteAddress, req.method, req.path)
    next()
  })
}

// Static
app.use('/', express.static('public'))

// Route
routes(app)

// Listening
/*
const options = {
  key: fs.readFileSync('./server.key'),
  cert: fs.readFileSync('./server.crt')
}

https.createServer(options, app).listen(app.get('port'), function () {
  debug.log('Stating listening ...')
})
*/

app.listen(app.get('port'), function () {
  debug.log('Start to listen on PORT %d ...', app.get('port'))
})

debug.log('Server initialized done')
