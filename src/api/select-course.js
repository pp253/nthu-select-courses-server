/* eslint-disable no-useless-return */

import { request, correctRequest, correctFormRequest } from '../lib/request'
import cheerio from 'cheerio'
import config from '../../config'
import response from './response'
import coursesDB from './courses_db.json'
import grabHelper from './grab-helper'
// import { grabData } from './grab-data'

function grabCurrentSelectedCoursesByBody(body) {
  const $ = cheerio.load(body)
  let table = $('table#T1 tbody tr').toArray()
  let currentSelectedCourses = []
  for (let tr of table) {
    let course = {
      number: tr.children[3].children[0].children[0].data.trim(),
      status: 0,
      orderCatalog: '',
      order: ''
    }

    let statusText = tr.children[19].children[0].data.trim()
    if (statusText === config.grabdata.waitingForRandomProcessText) {
      course.status = 2
    } else {
      course.status = 1
    }

    let orderText = tr.children[21].children[0].data.trim()
    if (orderText.length > 1) {
      let orderRegExec = /([^\d]?)(\d+)/.exec(orderText)
      course.orderCatalog = orderRegExec[1]
      course.order = parseInt(orderRegExec[2])
    } else if (orderText.length === 1) {
      course.orderCatalog = orderText
    }
    currentSelectedCourses.push(course)
  }
  return currentSelectedCourses
}

export function isAvailable(sessionToken) {
  return new Promise((resolve, reject) => {
    correctRequest({
      url: config.grabdata.preloadSelectedCoursesPage0.replace(
        '{0}',
        sessionToken
      )
    })
      .then(body => {
        if (body === config.grabdata.errSessionInterrupted) {
          reject(response.ResponseErrorMsg.SessionInterrupted())
          return
        } else if (body.startsWith(config.grabdata.errNotAvailable)) {
          reject(response.ResponseErrorMsg.NotAvailable())
          return
        }

        resolve(
          response.ResponseSuccessJSON({
            isAvailable: true
          })
        )
      })
      .catch(err => {
        reject(err)
      })
  })
}

let lastGrabData = 0
let latestCoursesDB = null

export function getCoursesDB(sessionToken) {
  return new Promise((resolve, reject) => {
    resolve(
      response.ResponseSuccessJSON({
        coursesDB: coursesDB
      })
    )
  })
}

/**
 * @api {post} api/select_course/getCurrentSelectedCourses Get current selected courses
 * @apiName getCurrentSelectedCourses
 * @apiGroup Select Courses
 * @apiDescription This method is only available in selection period.
 *
 * @apiParam {String} sessionToken Session token.
 *
 * @apiSuccess (200) {CurrentSelectedCourses} currentSelectedCourses Current Selected Courses.
 *
 * @apiParamExample  {Object} Request-Example
    {
      sessionToken: 'ifgqu3iupvrrts8fp4tpov1cm5'
    }
 *
 * @apiSuccessExample {Object} Success-Response
    {
      error: 0,
      time: 1517335710534,
      success: 1,
      currentSelectedCourses: [
        {
          number: '10610GE  150300',
          status: 0, // 0: 未選上, 1: 已選上, 2: 亂數中
          orderCatalog: '', // '', '通', '中', or '體'.
          order: '' // 0: not waiting for random process, 1~20: order
        }
      ]
    }
 */
export function getCurrentSelectedCourses(sessionToken) {
  return new Promise((resolve, reject) => {
    new Promise((resolve, reject) => {
      request({
        url: config.grabdata.preloadSelectedCoursesPage1,
        formData: {
          ACIXSTORE: sessionToken,
          submit: '%BDT%A9w%A8%C3%B6i%A4J%BF%EF%BD%D2%A8t%B2%CE%0D%0AEnter'
        },
        method: 'POST'
      })
        .then(body => {
          reject(body)
        })
        .catch(err => {
          resolve(err)
        })
    })
      .then(() => {
        return request({
          url: config.grabdata.preloadSelectedCoursesPage2.replace(
            '{0}',
            sessionToken
          ),
          formData: {
            ACIXSTORE: sessionToken,
            submit: '%BDT%A9w%A8%C3%B6i%A4J%BF%EF%BD%D2%A8t%B2%CE%0D%0AEnter'
          },
          method: 'POST'
        })
      })
      .then(body => {
        return correctRequest({
          url: config.grabdata.currentSelectedCoursesPage.replace(
            '{0}',
            sessionToken
          ),
          method: 'POST'
        })
      })
      .then(body => {
        if (body === config.grabdata.errSessionInterrupted) {
          reject(response.ResponseErrorMsg.SessionInterrupted())
          return
        } else if (body.startsWith(config.grabdata.errNotAvailable)) {
          reject(response.ResponseErrorMsg.NotAvailable())
          return
        }

        resolve(
          response.ResponseSuccessJSON({
            currentSelectedCourses: grabCurrentSelectedCoursesByBody(body)
          })
        )
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * @api {post} api/select_course/addCourse Add course
 * @apiName addCourse
 * @apiGroup Select Courses
 * @apiDescription This method is only available in selection period.
 *
 * @apiParam {String} sessionToken Session token.
 * @apiParam {String} courseNumber Course number.
 * @apiParam {Number} order=0 Order.
 *
 * @apiSuccess (200) {CurrentSelectedCourses} currentSelectedCourses Current Selected Courses.
 *
 * @apiParamExample  {Object} Request-Example
    {
      sessionToken: 'ifgqu3iupvrrts8fp4tpov1cm5',
      courseNumber: '10610GE  150300',
      order: 0
    }
 * @apiSuccessExample {Object} Success-Response
    {
      error: 0,
      time: 1517335710534,
      success: 1,
      currentSelectedCourses: [
        {
          number: '10610GE  150300',
          status: 0, // 0: 未選上, 1: 已選上, 2: 亂數中
          orderCatalog: '', // '', '通', '中', or '體'.
          order: '' // 0: not waiting for random process, 1~20: order
        }
      ]
    }
 */
export function addCourse(sessionToken, courseNumber, order = '') {
  return new Promise((resolve, reject) => {
    if (!(courseNumber in coursesDB.courses)) {
      reject(response.ResponseErrorMsg.CourseNotFound())
      return
    } else if (coursesDB.courses[courseNumber].canceled) {
      reject(response.ResponseErrorMsg.CourseCanceled())
      return
    }

    let course = coursesDB.courses[courseNumber]
    let formData = {
      ACIXSTORE: sessionToken,
      aspr: `${order}`,
      ckey: courseNumber,
      code: course.sc_code,
      div: course.sc_div,
      real: course.sc_real,
      cred: course.credit,
      ctime: course.sc_ctime,
      num: course.size_limit,
      glimit: course.sc_glimit,
      type: course.sc_type,
      pre: course.sc_pre,
      range: course.sc_range,
      chkbtn: 'add'
    }

    new Promise((resolve, reject) => {
      correctFormRequest({
        url: config.grabdata.preSelectCoursesPage,
        formData: Object.assign({}, formData),
        headers: {
          Referer: config.grabdata.preSelectCoursesRefererPage.replace(
            '{0}',
            sessionToken
          )
        }
      })
        .then(body => {
          if (body === config.grabdata.errSessionInterrupted) {
            reject(response.ResponseErrorMsg.SessionInterrupted())
            return
          } else if (body.startsWith(config.grabdata.errNotAvailable)) {
            reject(response.ResponseErrorMsg.NotAvailable())
            return
          }
          reject(response.ResponseErrorMsg.NTHUServerError(body.slice(0, 200)))
        })
        .catch(() => {
          correctFormRequest({
            url: config.grabdata.currentSelectedCoursesPage.replace(
              '{0}',
              sessionToken
            ),
            formData: Object.assign({}, formData),
            headers: {
              Referer: config.grabdata.preSelectCoursesRefererPage.replace(
                '{0}',
                sessionToken
              )
            }
          })
            .then(body => {
              resolve(body)
            })
            .catch(err => {
              reject(err)
            })
        })
    })
      .then(body => {
        let warning = null

        if (!body.startsWith(config.grabdata.infoWaitingForRandomProcess)) {
          if (body === config.grabdata.errSessionInterrupted) {
            reject(response.ResponseErrorMsg.SessionInterrupted())
            return
          } else if (body.startsWith(config.grabdata.errDuplicatedCourse)) {
            reject(response.ResponseErrorMsg.DuplicatedCourse())
            return
          } else if (body.startsWith(config.grabdata.errCoursesTimeConflict)) {
            reject(response.ResponseErrorMsg.CoursesTimeConflict())
            return
          } else if (body.startsWith(config.grabdata.errSameCourse)) {
            reject(response.ResponseErrorMsg.SameCourse())
            return
          } else if (body.startsWith(config.grabdata.errViolatePrerequisite)) {
            reject(response.ResponseErrorMsg.ViolatePrerequisite())
            return
          } else if (body.startsWith(config.grabdata.errNotAvailable)) {
            reject(response.ResponseErrorMsg.NotAvailable())
            return
          } else if (body.startsWith(config.grabdata.warnCantBeGE)) {
            resolve(
              response.ResponseWarningJSON({
                currentSelectedCourses: grabCurrentSelectedCoursesByBody(body),
                id: 10,
                msg: '您選此課程只能當必選修，不能當通識！',
                more: ''
              })
            )
            return
          }

          const violateCourseRuleReg = /<script>alert\('(.*)'\);<\/script>[.\n]*<\/body>[.\n]*<\/html>[.\n]*$/g
          if (violateCourseRuleReg.test(body)) {
            let errMsg = /<script>alert\('(.*)'\);<\/script>[.\n]*<\/body>[.\n]*<\/html>[.\n]*$/g.exec(body)
            reject(
              response.ResponseErrorMsg.ViolateCourseRule(errMsg ? errMsg[1] : '')
            )
            return
          }

          if (body.startsWith('<script>')) {
            let errMsg = /^<script>alert\('(.*)'\);<\/script>/g.exec(body)
            reject(
              response.ResponseErrorMsg.OtherError(errMsg ? errMsg[1] : '')
            )
            console.log(errMsg)
            return
          }
        }

        resolve(
          response.ResponseSuccessJSON({
            currentSelectedCourses: grabCurrentSelectedCoursesByBody(body)
          })
        )
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * @api {post} api/select_course/quitCourse Quit course
 * @apiName quitCourse
 * @apiGroup Select Courses
 * @apiDescription This method is only available in selection period.
 *
 * @apiParam {String} sessionToken Session token.
 * @apiParam {String} courseNumber Course number.
 *
 * @apiSuccess (200) {CurrentSelectedCourses} currentSelectedCourses Current Selected Courses.
 *
 * @apiParamExample  {Object} Request-Example
 {
   sessionToken: 'ifgqu3iupvrrts8fp4tpov1cm5',
   courseNumber: '10610GE  150300'
 }
 * @apiSuccessExample {Object} Success-Response
 {
   error: 0,
   time: 1517335710534,
   success: 1,
   currentSelectedCourses: [
     {
       number: '10610GE  150300',
       status: 0, // 0: 未選上, 1: 已選上, 2: 亂數中
       orderCatalog: '', // '', '通', '中', or '體'.
       order: '' // 0: not waiting for random process, 1~20: order
     }
   ]
 }
 */
export function quitCourse(sessionToken, courseNumber) {
  return new Promise((resolve, reject) => {
    let formData = {
      ACIXSTORE: sessionToken,
      c_key: courseNumber,
      chkbtn: 'quit'
    }

    correctFormRequest({
      url: config.grabdata.currentSelectedCoursesPage.replace(
        '{0}',
        sessionToken
      ),
      formData: formData
    })
      .then(body => {
        if (body === config.grabdata.errSessionInterrupted) {
          reject(response.ResponseErrorMsg.SessionInterrupted())
          return
        } else if (body.startsWith(config.grabdata.errNotAvailable)) {
          reject(response.ResponseErrorMsg.NotAvailable())
          return
        }

        resolve(
          response.ResponseSuccessJSON({
            currentSelectedCourses: grabCurrentSelectedCoursesByBody(body)
          })
        )
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * @api {post} api/select_course/editOrder Edit order
 * @apiName editOrder
 * @apiGroup Select Courses
 * @apiDescription This method is only available in selection period.
 *
 * @apiParam {String} sessionToken Session token.
 * @apiParam {Course[]} newOrder Course number.
 * @apiParam {Course[]} oldOrder Course number.
 *
 * @apiSuccess (200) {CourseStatus[]} currentSelectedCourses Current Selected Courses.
 *
 * @apiParamExample  {Object} Request-Example
 {
   sessionToken: 'ifgqu3iupvrrts8fp4tpov1cm5',
   newOrder: [],
   oldOrder: []
 }
 * @apiSuccessExample {Object} Success-Response
 {
   error: 0,
   time: 1517335710534,
   success: 1,
   currentSelectedCourses: [
     {
       number: '10610GE  150300',
       status: 0, // 0: 未選上, 1: 已選上, 2: 亂數中
       orderCatalog: '', // '', '通', '中', or '體'.
       order: '' // 0: not waiting for random process, 1~20: order
     }
   ]
 }

 原本是讓退選全部一起完成，但是似乎太快的操作會導致session interrupted.
 */
export function editOrder(sessionToken, newOrder, oldOrder) {
  return new Promise((resolve, reject) => {
    if (newOrder.length > oldOrder.length) {
      reject(response.ResponseErrorMsg.NewOrderMoreThanOldOrder())
      return
    } else if (newOrder.includes(undefined)) {
      reject(response.ResponseErrorMsg.NewOrderNotEmpty())
      return
    } else if (newOrder.length !== oldOrder.filter(e => e !== null).length) {
      reject(response.ResponseErrorMsg.OldOrderIncludesAllInNewOrder())
      return
    }

    let removeJob = []
    let addJob = []

    for (let order = 0; order < oldOrder.length; order++) {
      const oldCourse = oldOrder[order]
      const newCourse = newOrder[order]

      /**
       * If both newCourse and oldCourse is empty, skip it.
       * This scenario should not happen.
       */
      if (!newCourse && !oldCourse) {
        continue
      } else if ((newCourse && oldCourse) && (newCourse.number === oldCourse.number)) {
        /**
         * If both course exist and have same courseNumber, skip it.
         */
        continue
      }

      if (newCourse) {
        /**
         * newCourse.order = order + 1
         * is to obey that the order is from 1.
         */
        newCourse.order = order + 1
        addJob.push(newCourse)
      }
      if (oldCourse) {
        removeJob.push(oldCourse)
      }
    }

    Promise.resolve()
      .then(() => {
        return new Promise((resolve, reject) => {
          let jobSequence = Promise.resolve()
          for (let course of removeJob) {
            jobSequence = jobSequence.then(() => {
              return quitCourse(sessionToken, course.number)
            })
          }
          jobSequence
            .then(res => {
              resolve(res)
            })
            .catch(err => {
              reject(err)
            })
        })
      })
      .then(() => {
        return new Promise((resolve, reject) => {
          let jobSequence = Promise.resolve()
          for (let course of addJob) {
            jobSequence = jobSequence.then(() => {
              return addCourse(sessionToken, course.number, course.order)
            })
          }
          jobSequence
            .then(res => {
              resolve(res)
            })
            .catch(err => {
              reject(err)
            })
        })
      })
      .then(res => {
        resolve(response.ResponseSuccessJSON(res))
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * @api {post} api/select_course/getSyllabus Get syllabus
 * @apiName getSyllabus
 * @apiGroup Select Courses
 *
 * @apiParam {String} sessionToken Session token.
 * @apiParam {CourseNumber} courseNumber Course number.
 *
 * @apiSuccess (200) {Syllabus} syllabus Syllabus.
 *
 * @apiParamExample  {Object} Request-Example
 {
   sessionToken: 'ifgqu3iupvrrts8fp4tpov1cm5',
   courseNumber: '10610GE  150300',
 }
 * @apiSuccessExample {Object} Success-Response
 {
   error: 0,
   time: 1517335710534,
   success: 1,
   syllabus: {
    number: '10610GE  150300',
    chineseTitle: '',
    englishTitle: '',
    credit: '',
    time: '',
    room: '',
    professor: '',
    size_limit: '',
    briefDescription: '',
    description: '',
    file: false
   }
 }
 */
export function getSyllabus(sessionToken, courseNumber) {
  return new Promise((resolve, reject) => {
    correctRequest({
      url: config.grabdata.syllabusPage
        .replace('{0}', sessionToken)
        .replace('{1}', courseNumber)
    })
      .then(body => {
        if (body === config.grabdata.errSessionInterrupted) {
          reject(response.ResponseErrorMsg.SessionInterrupted())
          return
        } else if (body === config.grabdata.errNotValidCourseNumber) {
          reject(response.ResponseErrorMsg.NotValidCourseNumber())
          return
        }

        const $ = cheerio.load(body)
        let trArray = $('table:nth-child(1) tbody tr')
        let courseBriefDescription = $(
          'table:nth-child(4) tbody tr:nth-child(2) td'
        )
          .toArray()[0]
          .children[0].data.replace(/\n/g, '<br>')
        let courseDescription = $('table:nth-child(5) tbody tr:nth-child(2) td')
          .text()
          .replace(/\n/g, '<br>')
        resolve(
          response.ResponseSuccessJSON({
            syllabus: {
              number: trArray.get(1).children[2].children[0].data.trim(),
              chineseTitle: trArray.get(2).children[3].children[0].data.trim(),
              englishTitle: trArray.get(3).children[3].children[0].data.trim(),
              credit: trArray.get(1).children[5].children[0].data.trim(),
              time: trArray.get(5).children[2].children[0].data.trim(),
              room: trArray.get(5).children[5].children[0].data.trim(),
              professor: trArray.get(4).children[3].children[0].data.trim(),
              size_limit: trArray.get(1).children[8].children[0].data.trim(),
              briefDescription: courseBriefDescription,
              description: courseDescription,
              file: courseDescription.startsWith(
                config.grabdata.infoSyllabusIsFile
              )
            }
          })
        )
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * @api {post} api/select_course/getAvailableSelectionResult Get available selection result
 * @apiName getAvailableSelectionResult
 * @apiGroup Select Courses
 *
 * @apiParam {String} sessionToken Session token.
 *
 * @apiSuccess (200) {AvailableSelectionResult} availableSelectionResult Available selection result.
 * @apiSuccess (200) {Semester} semester Semester.
 * @apiSuccess (200) {Phase} phase Phase.
 * @apiSuccess (200) {Boolean} editable Editable.
 *
 * @apiParamExample  {Object} Request-Example
 {
   sessionToken: 'ifgqu3iupvrrts8fp4tpov1cm5'
 }
 * @apiSuccessExample {Object} Success-Response
 {
   error: 0,
   time: 1517335710534,
   success: 1,
   availableSelectionResult: {
     '10610': [
       '100',
       '100P'
     ]
   },
   semester: '',
   phase: '',
   editable: false,
   selectionPhase: false,
   addOrDropPhase: false,
   withdrawalPhase: false
 }
 */
export function getAvailableSelectionResult(sessionToken) {
  return new Promise((resolve, reject) => {
    let availableSelectionResult = {}
    let currentSemester = ''

    correctFormRequest({
      url: config.grabdata.selectionResultPage,
      formData: {
        ACIXSTORE: sessionToken
      }
    })
      .then(body => {
        if (body === config.grabdata.errSessionInterrupted) {
          reject(response.ResponseErrorMsg.SessionInterrupted())
          return
        }

        let originalSemeterText = {}

        const $ = cheerio.load(body)
        let selectSemester = $('select[name=semester] option').toArray()
        for (let option of selectSemester) {
          let semesterText = /^(\d+),(\d+)$/.exec(option.attribs['value'])
          let semester = semesterText[1] + semesterText[2]
          availableSelectionResult[semester] = []
          originalSemeterText[semester] = option.attribs['value']
          currentSemester = semester
        }

        let getPeriodByNode = (selectPhaseArray, semester) => {
          for (let option of selectPhaseArray) {
            let phase = option.attribs['value']
            if (phase) {
              availableSelectionResult[semester].push(phase)
            }
          }
        }

        let selectPhaseArray = $('select[name=phase] option').toArray()
        getPeriodByNode(selectPhaseArray, currentSemester)

        let jobSequence = []

        for (let semester in availableSelectionResult) {
          if (semester !== currentSemester) {
            jobSequence.push(
              new Promise((resolve, reject) => {
                correctFormRequest({
                  url: config.grabdata.selectionResultPage,
                  formData: {
                    ACIXSTORE: sessionToken,
                    sem_changed: 'Y',
                    semester: originalSemeterText[semester]
                  }
                })
                  .then(body => {
                    if (body === config.grabdata.errSessionInterrupted) {
                      reject(response.ResponseErrorMsg.SessionInterrupted())
                      return
                    }

                    const $ = cheerio.load(body)
                    let selectPhaseArray = $(
                      'select[name=phase] option'
                    ).toArray()
                    getPeriodByNode(selectPhaseArray, semester)
                    resolve()
                  })
                  .catch(err => {
                    reject(err)
                  })
              })
            )
          }
        }

        return Promise.all(jobSequence)
      })
      .then(() => {
        resolve(
          response.ResponseSuccessJSON({
            availableSelectionResult: availableSelectionResult,
            semester: currentSemester,
            phase:
              availableSelectionResult[currentSemester][
                availableSelectionResult[currentSemester].length - 1
              ],
            editable: true
          })
        )
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * @api {post} api/select_course/getSelectionResult Get selection result
 * @apiName getSelectionResult
 * @apiGroup Select Courses
 *
 * @apiParam {SessionToken} sessionToken Session token.
 * @apiParam {String} semester Semester. Available semester and phase could be obtained by `select_course/getAvailableSelectionResult`.
 * @apiParam {String} phase Phase.
 *
 * @apiSuccess (200) {String} semester Semester.
 * @apiSuccess (200) {String} phase Phase.
 * @apiSuccess (200) {Object} status Selection result.
 * @apiSuccess (200) {Object} randomFailed Courses that failed for enrollment.
 *
 * @apiParamExample  {Object} Request-Example
   {
     sessionToken: 'ifgqu3iupvrrts8fp4tpov1cm5',
     semester: '10610', // 106學年度上學期
     phase: '101P' // 第二次選課亂數後結果
   }
 *
 * @apiSuccessExample {Object} Success-Response
   {
     error: 0,
     time: 1517335710534,
     success: 1,
     semester: '10610',
     phase: '101P',
     status: [{
       number: '',
       title: '',
       credit: '',
       time: '',
       room: '',
       professor: '',
       size_limit: ''
     }],
     randomFailed: [{
       number: '',
       title: '',
       credit: '',
       time: '',
       room: '',
       professor: '',
       size_limit: '',
       reason: ''
     }]
   }
 */
export function getSelectionResult(sessionToken, semester, phase) {
  return new Promise((resolve, reject) => {
    let frommetedSemesterText = /(\d{3})(\d{2})/.exec(semester)
    let frommetedSemester = `${frommetedSemesterText[1]},${
      frommetedSemesterText[2]
    }`

    correctFormRequest({
      url: config.grabdata.selectionResultDetailPage,
      formData: {
        ACIXSTORE: sessionToken,
        semester: frommetedSemester,
        phase: phase
      }
    })
      .then(body => {
        if (body === config.grabdata.errSessionInterrupted) {
          reject(response.ResponseErrorMsg.SessionInterrupted())
          return
        }

        let status = {}
        let waitingForRandom = {}

        const $ = cheerio.load(body)
        let tableStatus = $($('table').get(1))
          .find('tbody tr')
          .toArray()
          .slice(2)
        for (let tr of tableStatus) {
          let tdArray = $(tr)
            .find('td')
            .toArray()
          let number = tdArray[0].children[0].data.trim()

          if (phase.endsWith('P') || phase.endsWith('S')) {
            status[number] = {
              number: number,
              title: tdArray[1].children[0].data.trim(),
              credit: tdArray[2].children[0].data.trim(),
              time: tdArray[3].children[0].data.trim(),
              room: tdArray[4].children[0].data.trim(),
              professor: tdArray[5].children[0].data.trim(),
              size_limit: tdArray[6].children[0].data.trim()
            }
          } else {
            let randomText = tdArray[11].children[0].data.trim()
            if (randomText === '待亂數處理(Wait for random process)') {
              let orderText = tdArray[10].children[0].data.trim()
              let orderCatalog = ''
              let order = ''
              if (orderText) {
                let orderRegExec = /(.+)(\d+)/.exec(orderText)
                orderCatalog = orderRegExec[1]
                order = parseInt(orderRegExec[2])
              }

              waitingForRandom[number] = {
                number: number,
                title: tdArray[1].children[0].data.trim(),
                credit: tdArray[4].children[0].data.trim(),
                time: tdArray[5].children[0].data.trim(),
                room: tdArray[6].children[0].data.trim(),
                professor: tdArray[7].children[0].data.trim(),
                size_limit: tdArray[8].children[0].data.trim(),
                order: order,
                orderCatalog: orderCatalog,
                comments: $(tdArray[2])
                  .text()
                  .trim(),
                limitation: $(tdArray[3])
                  .text()
                  .trim()
              }
            } else {
              status[number] = {
                number: number,
                title: tdArray[1].children[0].data.trim(),
                credit: tdArray[4].children[0].data.trim(),
                time: tdArray[5].children[0].data.trim(),
                room: tdArray[6].children[0].data.trim(),
                professor: tdArray[7].children[0].data.trim(),
                size_limit: tdArray[8].children[0].data.trim(),
                comments: $(tdArray[2])
                  .text()
                  .trim(),
                limitation: $(tdArray[3])
                  .text()
                  .trim()
              }
            }
          }
        }

        let randomFailed = {}

        if (phase.endsWith('P') || phase.endsWith('S')) {
          let tableRandomFailed = $($('table').get(2))
            .find('tbody tr')
            .toArray()
            .slice(2)
          for (let tr of tableRandomFailed) {
            let tdArray = $(tr)
              .find('td')
              .toArray()
            let number = tdArray[0].children[0].data.trim()
            randomFailed[number] = {
              number: number,
              title: tdArray[1].children[0].data.trim(),
              credit: tdArray[2].children[0].data.trim(),
              time: tdArray[3].children[0].data.trim(),
              room: tdArray[4].children[0].data.trim(),
              professor: tdArray[5].children[0].data.trim(),
              size_limit: tdArray[6].children[0].data.trim(),
              reason: $(tdArray[7])
                .text()
                .trim()
            }
          }
        }
        resolve(
          response.ResponseSuccessJSON({
            semester: semester,
            phase: phase,
            waitingForRandom: waitingForRandom,
            status: status,
            randomFailed: randomFailed
          })
        )
      })
      .catch(err => {
        reject(err)
      })
  })
}
