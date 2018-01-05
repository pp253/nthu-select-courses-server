const axios = require('axios')
const querystring = require('querystring')
var legacy = require('legacy-encoding')
// const iconv = require('iconv-lite')
// const encoding = require('encoding')
// var Buffer = require('buffer').Buffer
// var Iconv = require('iconv').Iconv

axios.defaults.headers.common['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
axios.defaults.headers.common['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36'
axios.defaults.headers.common['Accept-Language'] = 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7'
axios.defaults.headers.common['Referer'] = 'https://www.ccxp.nthu.edu.tw/ccxp/COURSE/JH/7/7.6/7.6.1/JH761004.php'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers.common['Origin'] = 'https://www.ccxp.nthu.edu.tw'
axios.defaults.headers.common['Connection'] = 'keep-alive'
axios.defaults.headers.common['Upgrade-Insecure-Requests'] = '1'
axios.defaults.headers.common['Host'] = 'www.ccxp.nthu.edu.tw'
axios.defaults.headers.common['Cache-Control'] = 'max-age=0'
axios.defaults.headers.common['Accept-Encoding'] = 'gzip, deflate, br'

axios.interceptors.response.use(function (response) {
  var ctype = response.headers['content-type']
  /*
  response.data = ctype.includes('charset=big5')
    ? legacy.decode(response.data, 'big5')
    : legacy.decode(response.data, 'utf-8')
    */
  console.log(ctype)
  response.data = legacy.decode(response.data, 'big5')
  return response
})

const NTHU_HOST_NAME = 'https://www.ccxp.nthu.edu.tw/ccxp/COURSE/JH/7/7.6/7.6.1/'

function getCoursesListByClass (deptAbbr) {
  axios.post('https://www.ccxp.nthu.edu.tw/ccxp/COURSE/JH/7/7.1/7.1.3/JH713004.php?ACIXSTORE=s7akg9bh04q58i0pbbts47d602', querystring.stringify({
    ACIXSTORE: 's7akg9bh04q58i0pbbts47d602',
    toChk: '2',
    new_dept: 'COTM',
    new_class: 'EECS103B',
    keyword: '',
    chks: 'code',
    ckey: '',
    chkbtn: ''
  })).then(function (result) {
    console.log(result.config)
    console.log('\n\n')
    // console.log(result.data)
    // console.log(legacy.decode(Buffer.from(result.data), 'big5'))
  })
}

function getCoursesListByDept (deptAbbr) {
  axios.post(NTHU_HOST_NAME + 'JH761004.php?toChk=2&amp;ACIXSTORE=d55vagkdq46f9iifv2945ttlc5', {
    ACIXSTORE: 'd55vagkdq46f9iifv2945ttlc5',
    toChk: 2,
    new_dept: 'IEEM',
    new_class: 'ESS 104BA',
    keyword: '',
    chks: 'dept',
    ckey: '',
    chkbtn: ''
  }).then(function (result) {
    console.log(result)
  })
}

function getDepts () {
  return {

  }
}

getCoursesListByClass('')
