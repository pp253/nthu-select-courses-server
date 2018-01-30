/* eslint-disable no-useless-return */

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

export function isAvailable (sessionToken) {
  return new Promise((resolve, reject) => {
    correctRequest({
      url: config.grabdata.preloadSelectedCoursesPage0.replace('{0}', sessionToken)
    })
    .then((body) => {
      if (body === config.grabdata.errSessionInterrupted) {
        reject(response.ResponseErrorMsg.SessionInterrupted())
        return
      } else if (body.startsWith(config.grabdata.errNotAvailable)) {
        reject(response.ResponseErrorMsg.NotAvailable())
        return
      }

      resolve(response.ResponseSuccessJSON({
        isAvailable: true
      }))
    })
    .catch((err) => {
      reject(err)
    })
  })
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
      .then((body) => {
        reject(body)
      })
      .catch((err) => {
        resolve(err)
      })
    })
    .then((body) => {
      if (body === config.grabdata.errSessionInterrupted) {
        reject(response.ResponseErrorMsg.SessionInterrupted())
        return
      } else if (body.startsWith(config.grabdata.errNotAvailable)) {
        reject(response.ResponseErrorMsg.NotAvailable())
        return
      }

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
      } else if (body.startsWith(config.grabdata.errNotAvailable)) {
        reject(response.ResponseErrorMsg.NotAvailable())
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
          'Referer': config.grabdata.preSelectCoursesRefererPage.replace('{0}', sessionToken)
        }
      })
      .then((body) => {
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
          url: config.grabdata.currentSelectedCoursesPage.replace('{0}', sessionToken),
          formData: Object.assign({}, formData),
          headers: {
            'Referer': config.grabdata.preSelectCoursesRefererPage.replace('{0}', sessionToken)
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
        } else if (body.startsWith('<script>')) {
          let errMsg = /^<script>alert\('(.*)'\);<\/script>/g.exec(body)
          reject(response.ResponseErrorMsg.OtherError(errMsg ? errMsg[1] : ''))
          return
        }
      }

      resolve(response.ResponseSuccessJSON({
        currentSelectedCourses: grabCurrentSelectedCoursesByBody(body)
      }))
    })
    .catch((err) => {
      console.log(err)
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
      } else if (body.startsWith(config.grabdata.errNotAvailable)) {
        reject(response.ResponseErrorMsg.NotAvailable())
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
      resolve(response.ResponseSuccessJSON(res))
    })
    .catch((err) => {
      reject(err)
    })
  })
}

export function getSyllabus (sessionToken, courseNumber) {
  return new Promise((resolve, reject) => {
    correctRequest({
      url: config.grabdata.syllabusPage.replace('{0}', sessionToken).replace('{1}', courseNumber)
    })
    .then((body) => {
      if (body === config.grabdata.errSessionInterrupted) {
        reject(response.ResponseErrorMsg.SessionInterrupted())
        return
      } else if (body === config.grabdata.errNotValidCourseNumber) {
        reject(response.ResponseErrorMsg.NotValidCourseNumber())
        return
      }

      const $ = cheerio.load(body)
      let trArray = $('table:nth-child(1) tbody tr')
      let courseBriefDescription = $('table:nth-child(4) tbody tr:nth-child(2) td').toArray()[0].children[0].data.replace(/\n/g, '<br>')
      let courseDescription = $('table:nth-child(5) tbody tr:nth-child(2) td').text().replace(/\n/g, '<br>')
      resolve(response.ResponseSuccessJSON({
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
          file: (courseDescription.startsWith(config.grabdata.infoSyllabusIsFile))
        }
      }))
    })
    .catch((err) => {
      reject(err)
    })
  })
}

export function getAvailableSelectionResult (sessionToken) {
  return new Promise((resolve, reject) => {
    let availableSelectionResult = {}
    let currentSemester = ''

    correctFormRequest({
      url: config.grabdata.selectionResultPage,
      formData: {
        ACIXSTORE: sessionToken
      }
    })
    .then((body) => {
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
          jobSequence.push(new Promise((resolve, reject) => {
            correctFormRequest({
              url: config.grabdata.selectionResultPage,
              formData: {
                ACIXSTORE: sessionToken,
                sem_changed: 'Y',
                semester: originalSemeterText[semester]
              }
            })
            .then((body) => {
              if (body === config.grabdata.errSessionInterrupted) {
                reject(response.ResponseErrorMsg.SessionInterrupted())
                return
              }

              const $ = cheerio.load(body)
              let selectPhaseArray = $('select[name=phase] option').toArray()
              getPeriodByNode(selectPhaseArray, semester)
              resolve()
            })
            .catch((err) => {
              reject(err)
            })
          }))
        }
      }

      return Promise.all(jobSequence)
    })
    .then(() => {
      resolve(response.ResponseSuccessJSON({
        availableSelectionResult: availableSelectionResult,
        semester: currentSemester,
        phase: availableSelectionResult[currentSemester][availableSelectionResult[currentSemester].length - 1],
        editable: false
      }))
    })
    .catch((err) => {
      reject(err)
    })
  })
}

export function getSelectionResult (sessionToken, semester, phase) {
  return new Promise((resolve, reject) => {
    let frommetedSemesterText = /(\d{3})(\d{2})/.exec(semester)
    let frommetedSemester = `${frommetedSemesterText[1]},${frommetedSemesterText[2]}`

    correctFormRequest({
      url: config.grabdata.selectionResultDetailPage,
      formData: {
        ACIXSTORE: sessionToken,
        semester: frommetedSemester,
        phase: phase
      }
    })
    .then((body) => {
      if (body === config.grabdata.errSessionInterrupted) {
        reject(response.ResponseErrorMsg.SessionInterrupted())
        return
      }

      let status = []

      const $ = cheerio.load(body)
      let tableStatus = $($('table').get(1)).find('tbody tr').toArray().slice(2)
      for (let tr of tableStatus) {
        let tdArray = $(tr).find('td').toArray()
        let number = tdArray[0].children[0].data.trim()
        status.push({
          number: number,
          title: tdArray[1].children[0].data.trim(),
          credit: tdArray[2].children[0].data.trim(),
          time: tdArray[3].children[0].data.trim(),
          room: tdArray[4].children[0].data.trim(),
          professor: tdArray[5].children[0].data.trim(),
          size_limit: tdArray[6].children[0].data.trim()
        })
      }

      let randomFailed = []

      if (phase.endsWith('P') || phase.endsWith('S')) {
        let tableRandomFailed = $($('table').get(2)).find('tbody tr').toArray().slice(2)
        for (let tr of tableRandomFailed) {
          let tdArray = $(tr).find('td').toArray()
          let number = tdArray[0].children[0].data.trim()
          randomFailed.push({
            number: number,
            title: tdArray[1].children[0].data.trim(),
            credit: tdArray[2].children[0].data.trim(),
            time: tdArray[3].children[0].data.trim(),
            room: tdArray[4].children[0].data.trim(),
            professor: tdArray[5].children[0].data.trim(),
            size_limit: tdArray[6].children[0].data.trim(),
            reason: $(tdArray[7]).text().trim()
          })
        }
      }

      resolve(response.ResponseSuccessJSON({
        selectionResult: {
          semester: semester,
          phase: phase,
          status: status,
          randomFailed: randomFailed
        }
      }))
    })
    .catch((err) => {
      reject(err)
    })
  })
}
