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
          'Referer': config.grabdata.preSelectCoursesRefererPage.replace('{0}', sessionToken),
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:57.0) Gecko/20100101 Firefox/57.0',
          'Accept-Language': 'zh-TW,zh;q=0.8,en-US;q=0.5,en;q=0.3'
        }
      })
      .then((body) => {
        if (body === config.grabdata.errSessionInterrupted) {
          reject(response.ResponseErrorMsg.SessionInterrupted())
          return
        }
        reject()
      })
      .catch(() => {
        correctFormRequest({
          url: config.grabdata.currentSelectedCoursesPage.replace('{0}', sessionToken),
          formData: Object.assign({}, formData),
          headers: {
            'Referer': config.grabdata.preSelectCoursesRefererPage.replace('{0}', sessionToken),
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:57.0) Gecko/20100101 Firefox/57.0'
          }
        })
        .then((body) => {
          resolve(body)
        })
        .catch((err) => {
          reject(err)
        })
      })
    })
    .then((body) => {
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
    .catch((err) => {
      reject(err)
    })
  })
}

export function editOrder (sessionToken, newOrder, oldOrder) {
  return new Promise((resolve, reject) => {
    let jobSequence = Promise.resolve()
    let waitForAddList = []

    for (let order = 0; order < newOrder.length; order++) {
      if (oldOrder.length < order) {
        jobSequence = jobSequence.then(() => {
          return addCourse(sessionToken, newOrder[order].number, order + 1)
        })
      } else if (newOrder[order].number !== oldOrder[order].number) {
        jobSequence = jobSequence.then(() => {
          return quitCourse(sessionToken, oldOrder[order].number)
        })
        waitForAddList.push({
          number: newOrder[order].number,
          order: order + 1
        })
      }
    }

    for (let course of waitForAddList) {
      jobSequence = jobSequence.then(() => {
        return addCourse(sessionToken, course.number, course.order)
      })
    }

    jobSequence = jobSequence
    .then((res) => {
      resolve(res)
    })
    .catch((err) => {
      reject(err)
    })
  })
}
