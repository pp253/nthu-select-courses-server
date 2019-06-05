import path from 'path'
import https from 'https'
import http from 'http'
import fs from 'fs'
import express from 'express'
import session from 'express-session'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import expressValidator from 'express-validator'
import compression from 'compression'
import cors from 'cors'
import io from '@pm2/io'

io.init({
  transactions: true, // will enable the transaction tracing
  http: true // will enable metrics about the http server (optional)
})

// import memwatch from 'memwatch-next'
import debug from './src/lib/debug'
import routes from './routes'
import { PRODUCTION, Timer } from './src/lib/utils'

console.log(`ENV: ${PRODUCTION ? 'production' : 'development'}`)

let timer = new Timer('init server', true)
timer.start()

const app = express()

// Security
app.use(helmet())

// Allow CORS
app.use(cors())

// Compression
app.use(compression({ credentials: true, origin: true }))

// Body parser and Validator
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(
  expressValidator({
    customValidators: {}
  })
)

// Session
app.use(
  session({
    secret: 'nthu-select-course',
    resave: false,
    saveUninitialized: false
  })
)

// Setting
app.set('port', 3000 || process.env.PORT || (PRODUCTION ? 443 : 80))
app.set('title', 'NTHU SELECT COURSE')

// Static
app.use('/', express.static('public'))

// Route
routes(app)
/*
if (PRODUCTION && fs.existsSync(path.join(__dirname, '/secret/private.key'))) {
  // Listening
  let httpsServer = https.createServer(
    {
      key: fs.readFileSync(path.join(__dirname, '/secret/private.key')),
      cert: fs.readFileSync(path.join(__dirname, '/secret/certificate.crt')),
      ca: fs.readFileSync(path.join(__dirname, '/secret/ca_bundle.crt'))
    },
    app
  )

  httpsServer.listen(443, () => {
    debug.log('Start to listen on PORT %d ...', 443)
    timer.stop()
  })

  // Auto redirect from port 80 to 443
  http
    .createServer((req, res) => {
      res.writeHead(301, {
        Location: 'https://' + req.headers['host'] + req.url
      })
      res.end()
    })
    .listen(80)
} else {
  app.listen(80, () => {
    debug.log('Start to listen on PORT %d ...', 80)
    timer.stop()
  })

  memwatch.on('leak', (e) => {
    console.log('LEAK', e)
  })
}
*/


app.listen(3000, () => {
  debug.log('Start to listen on PORT %d ...', 3000)
  timer.stop()
})

debug.log('Server initialized done')
