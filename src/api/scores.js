import {request, correctRequest} from '../lib/request'
import cheerio from 'cheerio'
import config from '../../config.json'
import response from './response'
import grabHelper from './grab-helper'

export function getScores (sessionToken) {
  return new Promise((resolve, reject) => {
    correctRequest({
      url: config.grabdata.scoresPage.replace('{0}', sessionToken),
      method: 'POST'
    })
    .then((body) => {
      if (body === config.grabdata.errSessionInterrupted) {
        reject(response.ResponseErrorMsg.SessionInterrupted())
        return
      }

      const $ = cheerio.load(body)
      let scores = {}
      let table = $('table').get(1).children[1].children // table > tbody.children

      for (let trIdx in table) {
        let tr = table[trIdx]
        if (tr.type === 'text') {
          continue
        }
        if (tr.children[1].type !== 'text' && tr.children[1].attribs.class !== 'input') {
          continue
        }

        let score = {
          semester: tr.children[1].children[0].data.trim() + tr.children[3].children[0].data.trim(),
          courseNumber: tr.children[5].children[0].data.trim(),
          courseTitle: tr.children[7].children[0].data.trim(),
          credit: tr.children[9].children[0].data.trim(),
          grade: tr.children[11].children[0].data.trim()
        }

        if (!scores[score.semester]) {
          scores[score.semester] = []
        }
        scores[score.semester].push(score)
      }

      resolve(response.ResponseSuccessJSON({
        scores: scores
      }))
    })
    .catch((err) => {
      reject(err)
    })
  })
}

export function getDistribution (sessionToken, courseNumber) {
  return new Promise((resolve, reject) => {
    correctRequest({
      url: config.grabdata.distributionPage.replace('{0}', sessionToken).replace('{1}', courseNumber)
    })
    .then((body) => {
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
        let peopleNum = /\((\d+)人\)/.exec(tdArray[idx + 1].children[2].data.trim())
        distribution[gradeList[idx]] = (peopleNum && peopleNum.length === 2) ? parseInt(peopleNum[1]) : 0
      }

      resolve({
        distribution: distribution
      })
    })
    .catch((err) => {
      reject(err)
    })
  })
}
