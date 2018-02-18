import {request, correctRequest} from '../lib/request'
import cheerio from 'cheerio'
import config from '../../config.json'
import response from './response'

/**
 * @api {post} api/user/getLoginToken Get login token
 * @apiName getLoginToken
 * @apiGroup user
 *
 * @apiSuccess (200) {LoginToken} loginToken Login token is used to mapping with authentication image.
 * @apiSuccess (200) {String} authImg An image encoded in `base64`.
 * 
 * @apiSampleRequest api/user/getLoginToken
 * 
 * @apiParamExample  {Object} Request-Example
   {
   }
 *
 * @apiSuccessExample {Object} Success-Response
   {
     error: 0,
     time: 1517335710534,
     success: 1,
     loginToken: '20180131-985013778448',
     authImg: 'iVBORw0KGgoAAAANSUhEUgAAAFAAAAAeCAMAAACMnWmDAAABFFBMVEX///8yMv/8uLyw78TGxeO70verw8XPzuPU+rHdodjmyNCi5cK/pfT/tMO8t6z1q6m0tNbG58T1qOba6qIjLHJ1e6Y+RoNaYJU1PX5rcKRKSpKAJ43v5PCveLe9z72fXamrn6+/k8bfyeKPQpuVW5afdpq0qqOqkJ+/xajPrtQDEJbf4fHAw+QiLaNCS7Bhab2gpdfAi7dCOaFhTaagdrKBh8qBYqxen1muz6yR0ZtoqWa5wNHq8+qFrYxro2rW59Wftq+Ssp6Gt4Jyq23C28Caw5cliobj8O/I4eCSxMJbp6Snnput09F2tbNAmJXBoqBpXULGwrjs6uehmYi0rqDZ1s+OhXF7cVmdeX+Mb2vAi6jjntHhVwF8AAACg0lEQVRIie2UaW/aQBCGV5BECDDmcJu2C6UJ6cFy9qDrNqSkAYztYnc5Epr0//+P7m2boCBV+ZhXI3l2wI/endk1AE960mOoVGKxRzPX83+ZwDRpvljuJT7Mc+dB6FB5JuetyELUDw9Z7MKVtpHpNAspDnN877fJtSZkDRRxBw9Ua6/vO0yn07Yt88AJ5y7PmMNrQshK4eLEZ89lUodvYj1stQUu/Q1/l6W54/N9uybr4XK1IDcgm2WR4FmWSGoQnkTOWp0Ofx6cY4yHouZSoMf2HQqfS7IBFJdN9PDYksBT2ID1GA8hseML/AOPRHHmhBQXBr7juBKYFYr16MVLyyqKDlKkLncRQi1m8ODy8gL/lFU2kzl9ek7I14QIhwkVpcNMBkCoq71+hwM5El/Jaih4LOEWN2QpehjDFSmwWBTEM3iq6obRRR8FD5zjsaz6fCqAzZuDb8g1uCfpMEP1Fr7TZeMTaqt8rKYyD2Yi8RyPPfTJVqpUaMgeUuR7WNMGjc/oiyFXV3iy5UIC1/pkR8RKyrJSKc4DH2JjpsC+ym1sb70Xii1vAytcFCjX1WjMhjFAX9VipKcCXGlQTHlB/pRBubzDoUQ2YFX/NEADlQ4xllng+DPgBnLYyzXZ3N4leSDukF4+PWbQRz2dj6O7IiR4hOm2nLAIgOoh0wk80Rb7qKv/M8X2RCBd+v0KPTnr1Wq9uPvLcYVCRKTHJp9nAZp1CPWg2xHQHtP7PAW7VFY91ER2l63jPONVKQ42mqLe6qPOQJzEEcWNp8OdQKlCIQl8lWcCzWbUQsQkPjhgMnoIppAyyeVYcIcJ9bq93qC9/dp+HiPmVA8fQzkhvT46YvFf+gelEmXM12SvVQAAAABJRU5ErkJggg=='
   }
 */
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

/**
 * @api {post} api/user/getSessionToken Get session token
 * @apiName getSessionToken
 * @apiGroup user
 *
 * @apiParam {String} username User name.
 * @apiParam {String} userpass User password.
 * @apiParam {String} authCheckCode Authentication check code showed on `authImg` provided by `getLoginToken`.
 * @apiParam {LoginToken} loginToken Login token provided by `getLoginToken`.
 *
 * @apiSuccess (200) {SessionToken} sessionToken Session token.
 * @apiSuccess (200) {String} username User name.
 *
 * @apiSampleRequest api/user/getSessionToken
 * 
 * @apiParamExample  {Object} Request-Example
   {
     username: '100090009',
     userpass: 'my_password',
     authCheckCode: '123456',
     loginToken: '20180131-985013778448'
   }
 *
 * @apiSuccessExample {Object} Success-Response
   {
     error: 0,
     time: 1517335710534,
     success: 1,
     sessionToken: 'ifgqu3iupvrrts8fp4tpov1cm5',
     username: '100090009'
   }
 */
export function getSessionToken (username, userpass, authCheckCode, loginToken) {
  return new Promise((resolve, reject) => {
    let formData = {
      account: username,
      passwd: userpass,
      passwd2: authCheckCode,
      fnstr: loginToken
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
