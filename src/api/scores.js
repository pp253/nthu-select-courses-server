import { request, correctRequest, correctFormRequest } from '../lib/request'
import cheerio from 'cheerio'
import config from '../../config'
import response from './response'
import grabHelper from './grab-helper'

/**
 * @api {post} api/scores/getScores Get scores
 * @apiName getScores
 * @apiGroup scores
 *
 * @apiParam {SessionToken} sessionToken Session token.
 *
 * @apiSuccess (200) {Object} scores Enrolled courses seperated by semesters.
 * @apiSuccess (200) {Object} courses Enrolled courses' full information.
 * @apiSuccess (200) {Object} overview Overall status of a student.
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
     "scores": {
       "10510": [
         "10510CL  101023",
         "10510E   100102"
       ],
       "10520": [
         "10520CS  135601",
         "10520EE  206000"
       ]
     },
     "courses": {
       "10520CS  135601": {
         "semester": "10520",
         "courseNumber": "10520CS  135601",
         "courseTitle": "計算機程式設計二",
         "credit": "3",
         "grade": "A+"
       },
       "10520EE  206000": {
         "semester": "10520",
         "courseNumber": "10520EE  206000",
         "courseTitle": "離散數學",
         "credit": "3",
         "grade": "B+"
       },
       "10510CL  101023": {
         "semester": "10510",
         "courseNumber": "10510CL  101023",
         "courseTitle": "大學中文",
         "credit": "2",
         "grade": "A"
       },
       "10510E   100102": {
         "semester": "10510",
         "courseNumber": "10510E   100102",
         "courseTitle": "工程導論",
         "credit": "2",
         "grade": "B-"
       }
     },
     "overview": {
       "10510": {
         "semester": "10510",
         "gpa": "4.29",
         "credit": "22",
         "deservedCredit": "22",
         "courses": "12",
         "summerVacationCredit": "0",
         "transferCredit": "0",
         "classRanking": "1/63",
         "departmentRanking": "1/63",
         "comments": ""
       },
       "10520": {
         "semester": "10520",
         "gpa": "1.72",
         "credit": "24",
         "deservedCredit": "24",
         "courses": "10",
         "summerVacationCredit": "0",
         "transferCredit": "0",
         "classRanking": "2/63",
         "departmentRanking": "2/63",
         "comments": ""
       }
     }
   }
 */
export function getScores(sessionToken) {
  return new Promise((resolve, reject) => {
    correctRequest({
      url: config.grabdata.scoresPage.replace('{0}', sessionToken),
      method: 'POST'
    })
      .then(body => {
        if (body === config.grabdata.errSessionInterrupted) {
          reject(response.ResponseErrorMsg.SessionInterrupted())
          return
        }

        const $ = cheerio.load(body)
        let scores = {}
        let courses = {}
        let table = $('table')
        let table1 = table.get(1).children[1].children

        for (let trIdx in table1) {
          let tr = table1[trIdx]
          if (tr.type === 'text') {
            continue
          }
          if (
            tr.children[1].type !== 'text' &&
            tr.children[1].attribs.class !== 'input'
          ) {
            continue
          }

          let semester =
            $(tr.children[1].children[0])
              .text()
              .trim() +
            $(tr.children[3].children[0])
              .text()
              .trim()
          let shortCourseNumber = $(tr.children[5].children[0])
            .text()
            .trim()

          let score = {
            semester: semester,
            courseNumber: semester + shortCourseNumber,
            courseTitle: $(tr.children[7].children[0])
              .text()
              .trim(),
            credit: $(tr.children[9].children[0])
              .text()
              .trim(),
            grade:
              tr.children[11].children[0] &&
              $(tr.children[11].children[0])
                .text()
                .trim()
          }

          if (!scores[score.semester]) {
            scores[score.semester] = []
          }
          scores[score.semester].push(score.courseNumber)
          courses[score.courseNumber] = score
        }

        let overview = {}
        try {
          let table4 = $(table.get(4))
            .find('tr')
            .toArray()
          table4.splice(0, 2)
          for (let tr of table4) {
            let semester =
              $(tr.children[1].children[0])
                .text()
                .trim() +
              $(tr.children[3].children[0])
                .text()
                .trim()
            let gpa =
              tr.children[5].children[0] &&
              $(tr.children[5].children[0])
                .text()
                .trim()
            gpa = gpa === '-' ? '' : gpa
            let relativeGradeAverage =
              tr.children[7].children[0].type === 'tag'
                ? ''
                : $(tr.children[7].children[0])
                    .text()
                    .trim()
            let credit =
              tr.children[9].children[0].type === 'tag'
                ? ''
                : $(tr.children[9].children[0])
                    .text()
                    .trim()
            let deservedCredit =
              tr.children[11].children[0].type === 'tag'
                ? ''
                : $(tr.children[11].children[0])
                    .text()
                    .trim()
            let courses =
              tr.children[13].children[0].type === 'tag'
                ? ''
                : $(tr.children[13].children[0])
                    .text()
                    .trim()
            let summerVacationCredit =
              tr.children[15].children[0].type === 'tag'
                ? ''
                : $(tr.children[15].children[0])
                    .text()
                    .trim()
            let transferCredit =
              tr.children[17].children[0].type === 'tag'
                ? ''
                : $(tr.children[17].children[0])
                    .text()
                    .trim()
            let classRanking = $(tr.children[19].children[0])
              .text()
              .trim()
            classRanking = classRanking === '-' ? '' : classRanking
            let departmentRanking = $(tr.children[21].children[0])
              .text()
              .trim()
            departmentRanking = departmentRanking === '-' ? '' : departmentRanking
            let relativeGradeClassRanking = $(tr.children[23].children[0])
              .text()
              .trim()
            relativeGradeClassRanking = relativeGradeClassRanking === '-' ? '' : relativeGradeClassRanking
            let relativeGradeDepartmentRanking = $(tr.children[25].children[0])
              .text()
              .trim()
            relativeGradeDepartmentRanking = relativeGradeDepartmentRanking === '-' ? '' : relativeGradeDepartmentRanking
            let comments = $(tr.children[27].children[0])
              .text()
              .trim()

            overview[semester] = {
              semester,
              gpa,
              relativeGradeAverage,
              credit,
              deservedCredit,
              courses,
              summerVacationCredit,
              transferCredit,
              classRanking,
              departmentRanking,
              relativeGradeClassRanking,
              relativeGradeDepartmentRanking,
              comments
            }
          }
        } catch (error) {
          console.error('overview error', error)
        }

        // cumulative
        let cumulative = {}
        try {
          let table5 = $(table.get(5))
            .find('tr:nth-child(1) td div:nth-child(1)')
            .toArray()
          let words = table5[0].children[0].data.split('：')[1].trim().split('、')
          cumulative.cumulativeRanking = words[0]
          cumulative.gpa = words[1]
        } catch (error) {
          console.error('cumulative error', error)
        }

        resolve(
          response.ResponseSuccessJSON({
            scores: scores,
            courses: courses,
            overview: overview,
            cumulative: cumulative
          })
        )
      })
      .catch(err => {
        reject(err)
      })
  })
}

getScores('4247mg2c9f4e2s5dgkao9gcas5').then(d => console.log(d)).catch(err => console.error(err))

/**
 * @api {post} api/scores/getDistribution Get distribution
 * @apiName getDistribution
 * @apiGroup scores
 *
 * @apiParam {SessionToken} sessionToken Session token.
 *
 * @apiSuccess (200) {Object} distribution Performance distribution of a course.
 *
 * @apiParamExample  {Object} Request-Example
   {
     sessionToken: 'ifgqu3iupvrrts8fp4tpov1cm5',
     courseNumber: '10610GE  150300'
   }
 *
 * @apiSuccessExample {Object} Success-Response
   {
     error: 0,
     time: 1517335710534,
     success: 1,
     distribution:  {
       A: 35,
       A+: 33,
       A-: 6,
       B: 1,
       B+: 1
       B-: 0,
       C: 0,
       C+: 0,
       C-: 0,
       D: 0,
       E: 1,
       X: 0,
       not_yet: 0,
       total: 77
     }
   }
 */
export function getDistribution(sessionToken, courseNumber) {
  return new Promise((resolve, reject) => {
    correctRequest({
      url: config.grabdata.distributionPage
        .replace('{0}', sessionToken)
        .replace('{1}', courseNumber)
    })
      .then(body => {
        if (body === config.grabdata.errSessionInterrupted) {
          reject(response.ResponseErrorMsg.SessionInterrupted())
          return
        }

        const $ = cheerio.load(body)
        let tdArray = $('table table tbody tr:nth-child(2) td').toArray()
        let distribution = {}
        let gradeList = [
          'A+',
          'A',
          'A-',
          'B+',
          'B',
          'B-',
          'C+',
          'C',
          'C-',
          'D',
          'E',
          'X',
          'not_yet',
          'total'
        ]

        for (let idx = 0; idx < gradeList.length; idx++) {
          let peopleNum = /\((\d+)人\)/.exec(
            $(tdArray[idx + 1].children[2])
              .text()
              .trim()
          )
          distribution[gradeList[idx]] =
            peopleNum && peopleNum.length === 2 ? parseInt(peopleNum[1]) : 0
        }

        resolve(
          response.ResponseSuccessJSON({
            distribution: distribution
          })
        )
      })
      .catch(err => {
        reject(err)
      })
  })
}

export function getClassmates(sessionToken, courseNumber) {
  return new Promise((resolve, reject) => {
    let formDataPreload = {
      ACIXSTORE: sessionToken,
      Submit: '%A6%5E%A4W%A4%40%AD%B6Back'
    }
    correctFormRequest({
      url: config.grabdata.getClassmatesListPreloadPage,
      formData: Object.assign({}, formDataPreload),
      headers: {
        Referer: config.grabdata.getClassmatesPage
      }
    })
      .then(() => {
        let formData = {
          ACIXSTORE: sessionToken
        }
        return correctFormRequest({
          url: config.grabdata.getClassmatesListPage.replace(
            '{0}',
            sessionToken
          ),
          formData: Object.assign({}, formData),
          headers: {
            Referer: config.grabdata.getClassmatesPage
          }
        })
      })
      .then(body => {
        let formData = {
          ACIXSTORE: sessionToken,
          ckey: courseNumber,
          Submit: '%BDT%A9w'
        }

        return correctFormRequest({
          url: config.grabdata.getClassmatesPage,
          formData: Object.assign({}, formData),
          headers: {
            Referer: config.grabdata.getClassmatesListPage.replace(
              '{0}',
              sessionToken
            )
          }
        })
      })
      .then(body => {
        if (body === config.grabdata.errSessionInterrupted) {
          reject(response.ResponseErrorMsg.SessionInterrupted())
          return
        }
        if (body.startsWith(config.grabdata.errCantGetClassmates)) {
          resolve(
            response.ResponseSuccessJSON({
              classmates: [],
              courseNumber: ''
            })
          )
          return
        }

        const $ = cheerio.load(body)

        let trArray = $('form[name="form1"] table tbody tr.class3').toArray()

        let classmates = []
        for (let tr of trArray) {
          classmates.push({
            name: $(tr.children[7])
              .text()
              .trim(),
            studentId: $(tr.children[5])
              .text()
              .trim(),
            department: $(tr.children[9])
              .text()
              .trim(),
            email: $(tr.children[11])
              .text()
              .trim()
          })
        }

        resolve(
          response.ResponseSuccessJSON({
            classmates: classmates,
            courseNumber: courseNumber
          })
        )
      })
      .catch(err => {
        reject(err)
      })
  })
}
