import * as selectCourse from '../src/api/select-course'
import * as scores from '../src/api/scores'
import * as user from '../src/api/user'
import response from '../src/api/response'
import validation from '../src/api/validator'
import debug from '../src/lib/debug'
import { Timer } from '../src/lib/utils'

function apiMethodWrapper(apiFunc, apiArgus) {
  return (req, res, next) => {
    let checkObj = {}
    let argusArr = []
    for (let key of apiArgus) {
      checkObj[key] = validation[key]
      argusArr.push(req.body[key])
    }

    return new Promise((resolve, reject) => {
      req.check(checkObj)

      req.getValidationResult().then(err => {
        if (!err.isEmpty()) {
          reject(
            response.ResponseErrorMsg.ApiArgumentValidationError(err.mapped())
          )
          return
        }

        resolve(apiFunc(...argusArr))
      })
    })
  }
}

export default function initialize(app) {
  app.all('*', (req, res, next) => {
    debug.log(req.ip, req.originalUrl)
    next()
  })

  app.post('/api/:module/:method', (req, res, next) => {
    const apiRoute = {
      user: {
        getLoginToken(req, res, next) {
          return user.getLoginToken()
        },
        getSessionToken: apiMethodWrapper(user.getSessionToken, [
          'username',
          'userpass',
          'authCheckCode',
          'loginToken'
        ]),
        logout: apiMethodWrapper(user.logout, ['sessionToken'])
      },
      scores: {
        getScores: apiMethodWrapper(scores.getScores, ['sessionToken']),
        getDistribution: apiMethodWrapper(scores.getDistribution, [
          'sessionToken',
          'courseNumber'
        ])
      },
      select_course: {
        getCurrentSelectedCourses: apiMethodWrapper(
          selectCourse.getCurrentSelectedCourses,
          ['sessionToken']
        ),
        editOrder: apiMethodWrapper(selectCourse.editOrder, [
          'sessionToken',
          'newOrder',
          'oldOrder'
        ]),
        addCourse: apiMethodWrapper(selectCourse.addCourse, [
          'sessionToken',
          'courseNumber',
          'order'
        ]),
        quitCourse: apiMethodWrapper(selectCourse.quitCourse, [
          'sessionToken',
          'courseNumber'
        ]),
        getSyllabus: apiMethodWrapper(selectCourse.getSyllabus, [
          'sessionToken',
          'courseNumber'
        ]),
        getAvailableSelectionResult: apiMethodWrapper(
          selectCourse.getAvailableSelectionResult,
          ['sessionToken']
        ),
        getSelectionResult: apiMethodWrapper(selectCourse.getSelectionResult, [
          'sessionToken',
          'semester',
          'phase'
        ])
      }
    }

    let moduleName = req.params.module
    let methodName = req.params.method
    if (moduleName in apiRoute && methodName in apiRoute[moduleName]) {
      // const timer = new Timer(`${moduleName}/${methodName}`)
      // timer.start()
      apiRoute[moduleName][methodName](req, res, next)
        .then(result => {
          // timer.stop()
          res.json(result)
        })
        .catch(err => {
          // timer.stop()
          console.error(err)
          res.json(err)
        })
    } else {
      res
        .status(400)
        .json(response.ResponseErrorMsg.ApiModuleNotExist(moduleName))
    }
  })

  app.get('/echo', function(req, res, next) {
    res.send('echo')
  })

  app.get('*', function(req, res, next) {
    res.status(404).send('404 NOT FOUND')
  })
}
