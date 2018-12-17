import {request, correctRequest} from '../lib/request'
import cheerio from 'cheerio'
import config from '../../config'
import response from './response'
import grabHelper from './grab-helper'

/**
 * @api {post} api/course_evaluation_survey/getList Get List
 * @apiName getList
 * @apiGroup course_evaluation_survey
 *
 * @apiParam {SessionToken} sessionToken Session token.
 *
 * @apiSuccess (200) {Object} survey Survey that the user can do
 * @apiSuccess (200) {Boolean} done User has done all the survey
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
     "survey": {
       "10710CS 342302": {
        "courseTitle": {
          "zh": "作業系統",
          "en": "Operating Systems"
        },
        "professor": {
          "zh": "周百祥",
          "en": "CHOU, PAI-HSIANG"
        },
        "enrollment": 91,
        "done": false
       },
     },
     "done": false
   }
 */
export function getList (sessionToken) {
  return new Promise((resolve, reject) => {
    correctRequest({
      url: config.grabdata.courseEvaluationSurvey.index.replace('{0}', sessionToken),
      method: 'GET'
    })
    .then((body) => {
      if (body === config.grabdata.errSessionInterrupted) {
        reject(response.ResponseErrorMsg.SessionInterrupted())
        return
      }

      const $ = cheerio.load(body)
      let table = $('table tbody tr').toArray()
      table.splice(0, 4)

      let done = false

      let survey = {}
      for (let tr of table) {
        let tds = tr.children
        if (tds.length < 15) {
          continue
        }
        let courseNumber = tds[3].children[0].data.trim()
        let course = {
          'courseTitle': {
            'zh': tds[5].children[0].data.trim(),
            'en': tds[5].children[2].children[0].data.trim()
          },
          'professor': {
            'zh': tds[9].children[0].data.trim(),
            'en': tds[9].children[3].children[0].data.trim()
          },
          'enrollment': parseInt(tds[11].children[0].data.trim()),
          'done': false
        }
        survey[courseNumber] = course
      }
      console.log(survey)

      resolve(response.ResponseSuccessJSON({
        survey: survey,
        done: done
      }))
    })
    .catch((err) => {
      reject(err)
    })
  })
}

/**
 * @api {post} api/course_evaluation_survey/getSurvey Get List
 * @apiName getSurvey
 * @apiGroup course_evaluation_survey
 *
 * @apiParam {SessionToken} sessionToken Session token.
 * @apiParam {CourseNumber} courseNumber Course number.
 *
 * @apiSuccess (200) {Object} survey Survey that the user can do
 * @apiSuccess (200) {Boolean} done User has done the the survey
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
     "survey": {
       "courseNumber": "10710CS 342302",
       "courseTitle": {
         "zh": "作業系統"
       },
       "done": false,
       "content": [
         {
           "type": "part",
           "title": "第一部分 - 背景資料(必填)",
           "questions": [
             {
               "type": "multipleSelection",
               "title": "1. 修讀本課程理由(可複選)",
               "availableAnswers": [
                 {
                   "name": "reason_1",
                   "value": "必修或必選",
                   "text": "必修或必選"
                 }
               ]
             },
             {
               "type": "multipleChoice",
               "title": "2. 這門課我的缺席狀況",
               "name": "absence",
               "availableAnswers": [
                 {
                   "value": "從不缺席",
                   "text": "從不缺席"
                 },
                 {
                   "value": "1~3次",
                   "text": "1~3次"
                 }
               ]
             }
           ]
         },
         {
           "type": "part",
           "title": "第二部分 - 對本課程教學的意見",
           "sections": [
             {
               "type": "section",
               "title": "教學內容",
               "questions": [
                 {
                   "type": "multipleChoice",
                   "title": "1. 內容豐富且組織完善，符合教學目標",
                   "name": "sec_0_1",
                   "availableAnswers": [
                     {
                       "value": "5",
                       "text": "非常同意(5分)"
                     },
                     {
                       "value": "4",
                       "text": "同意(4分)"
                     }
                   ]
                 }
               ]
             }
           ]
         }
       ]
     },
     "done": false
   }
 */
