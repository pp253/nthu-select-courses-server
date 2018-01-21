import {request, correctRequest} from '../lib/request'
import cheerio from 'cheerio'
import config from '../../config.json'
import response from './response'

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
