import {request, correctRequest} from '../lib/request'
import cheerio from 'cheerio'
import config from '../../config.json'
import response from './response'
import coursesDb from './courses_db.json'

export function getCoursesList () {
  return new Promise((resolve, reject) => {
    resolve(response.ResponseSuccessJSON({
      data: coursesDb
    }))
  })
}
