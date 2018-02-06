import express from 'express'
import session from 'express-session'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import expressValidator from 'express-validator'
import compression from 'compression'
import cors from 'cors'
import debug from './src/lib/debug'
import routes from './routes'
import path from 'path'
import https from 'https'
import http from 'http'
import fs from 'fs'

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
  secret: 'nthu-easy-course',
  resave: false,
  saveUninitialized: false
}))

// Setting
app.set('port', 443)
app.set('title', 'NTHU EASY COURSE')

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
let httpsServer = https.createServer({
  key: fs.readFileSync(path.join(__dirname, '/secret/private.key')),
  cert: fs.readFileSync(path.join(__dirname, '/secret/certificate.crt'))
}, app)

httpsServer.listen(app.get('port'), function () {
  debug.log('Start to listen on PORT %d ...', app.get('port'))
})

// Auto redirect from port 80 to 443
http.createServer((req, res) => {
  res.writeHead(301, {
    'Location': 'https://' + req.headers['host'] + req.url
  })
  res.end()
}).listen(80)

debug.log('Server initialized done')
