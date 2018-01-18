import {request, correctRequest} from '../lib/request'
import cheerio from 'cheerio'
import config from '../../config.json'
import response from './response'

export function getLoginToken () {
  return new Promise((resolve, reject) => {
    correctRequest({
      url: config.grabdata.nthuBase,
      method: 'GET'
    })
    .then((body) => {
      const $ = cheerio.load(body)
      let loginToken = $('input[name=fnstr]').attr('value')
      request({
        url: config.grabdata.authImg.replace('{0}', loginToken),
        encoding: null
      })
      .then((authImg) => {
        resolve(response.ResponseSuccessJSON({
          loginToken: loginToken,
          authImg: Buffer.from(authImg).toString('base64')
        }))
      })
    })
    .catch((err) => {
      reject(err)
    })
  })
}

export function getSessionToken (loginInfo) {
  return new Promise((resolve, reject) => {
    let formData = {
      account: loginInfo.username,
      passwd: loginInfo.userpass,
      passwd2: loginInfo.authCheckCode,
      fnstr: loginInfo.loginToken
    }

    correctRequest({
      url: config.grabdata.authPage,
      method: 'POST',
      formData: formData
    })
    .then((body) => {
      if (body.startsWith(config.grabdata.errSystemErrorText)) {
        // response with System Error
        reject(response.ResponseErrorMsg.NTHUServerError())
      } else if (body.startsWith(config.grabdata.errAuthCheckCodeWrongText)) {
        // response with Authentication ID Error!
        reject(response.ResponseErrorMsg.AuthCheckCodeNotCorrect())
      } else {
        let [, sessionToken, username] = /^<meta http-equiv="refresh" content=0;url=select_entry\.php\?ACIXSTORE=(.*?)&hint=(.*?)>$/.exec(body)

        correctRequest({
          url: config.grabdata.selectPage.replace('{0}', sessionToken).replace('{1}', username),
          method: 'GET'
        })
        .then((body) => {
          if (body.startsWith(config.grabdata.errUserInfoWrongText)) {
            // response with Error account or password!
            reject(response.ResponseErrorMsg.UserInfoNotCorrect())
          } else {
            // Success!
            resolve(response.ResponseSuccessJSON({
              sessionToken: sessionToken,
              username: username
            }))
          }
        })
      }
    })
    .catch((err) => {
      reject(err)
    })
  })
}
