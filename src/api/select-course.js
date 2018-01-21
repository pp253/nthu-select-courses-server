import {request, correctRequest, correctFormRequest} from '../lib/request'
import cheerio from 'cheerio'
import config from '../../config.json'
import response from './response'
import coursesDB from './courses_db.json'
import grabHelper from './grab-helper'

export function getCoursesList () {
  return new Promise((resolve, reject) => {
    resolve(response.ResponseSuccessJSON({
      data: coursesDB
    }))
  })
}

function grabCurrentSelectedCoursesByBody (body) {
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
    if (orderText.length >= 2) {
      let orderRegExec = /(.+)(\d+)/.exec(orderText)
      course.orderCatalog = orderRegExec[1]
      course.order = parseInt(orderRegExec[2])
    } else if (orderText.length === 1) {
      course.orderCatalog = orderText
    }
    currentSelectedCourses.push(course)
  }
  return currentSelectedCourses
}

export function getCurrentSelectedCourses (sessionToken) {
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
      .catch((err) => {
        resolve(err)
      })
    })
    .then((body) => {
      return request({
        url: config.grabdata.preloadSelectedCoursesPage2.replace('{0}', sessionToken),
        formData: {
          ACIXSTORE: sessionToken,
          submit: '%BDT%A9w%A8%C3%B6i%A4J%BF%EF%BD%D2%A8t%B2%CE%0D%0AEnter'
        },
        method: 'POST'
      })
    })
    .then((body) => {
      return correctRequest({
        url: config.grabdata.currentSelectedCoursesPage.replace('{0}', sessionToken),
        method: 'POST'
      })
    })
    .then((body) => {
      if (body === config.grabdata.errSessionInterrupted) {
        reject(response.ResponseErrorMsg.SessionInterrupted())
        return
      }

      resolve(response.ResponseSuccessJSON({
        currentSelectedCourses: grabCurrentSelectedCoursesByBody(body)
      }))
    })
    .catch((err) => {
      reject(err)
    })
  })
}

export function addCourse (sessionToken, courseNumber, order = '') {
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
      aspr: order,
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

    correctFormRequest({
      url: config.grabdata.preSelectCoursesPage,
      formData: formData,
      headers: {
        'Referer': config.grabdata.preSelectCoursesRefererPage.replace('{0}', sessionToken)
      }
    })
    .catch(() => {
      return correctRequest({
        url: config.grabdata.currentSelectedCoursesPage.replace('{0}', sessionToken),
        formData: formData,
        headers: {
          'Referer': config.grabdata.preSelectCoursesRefererPage.replace('{0}', sessionToken)
        }
      })
    })
    .then((body) => {
      if (body === config.grabdata.errSessionInterrupted) {
        reject(response.ResponseErrorMsg.SessionInterrupted())
        return
      } else if (body.startsWith(config.grabdata.errDuplicatedCourse)) {
        reject(response.ResponseErrorMsg.DuplicatedCourse())
        return
      }
      resolve(response.ResponseSuccessJSON({
        currentSelectedCourses: grabCurrentSelectedCoursesByBody(body)
      }))
    })
  })
}

export function quitCourse (sessionToken, courseNumber) {
  return new Promise((resolve, reject) => {
    let formData = {
      ACIXSTORE: sessionToken,
      c_key: courseNumber,
      chkbtn: 'quit'
    }

    correctFormRequest({
      url: config.grabdata.currentSelectedCoursesPage.replace('{0}', sessionToken),
      formData: formData
    })
    .then((body) => {
      if (body === config.grabdata.errSessionInterrupted) {
        reject(response.ResponseErrorMsg.SessionInterrupted())
        return
      }
      resolve(response.ResponseSuccessJSON({
        currentSelectedCourses: grabCurrentSelectedCoursesByBody(body)
      }))
    })
  })
}
