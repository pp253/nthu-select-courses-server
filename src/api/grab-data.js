const request = require('request-promise-native')
const iconv = require('iconv-lite')
const cheerio = require('cheerio')
const asyncPool = require('tiny-async-pool')
const fs = require('fs')

const TENTATIVE = false

function grabHelper(node, level = 0, initIndex = 0) {
  if (node instanceof Array) {
    let idx = initIndex
    for (let childNode of node) {
      grabHelper(childNode, level, idx++)
    }
  } else {
    if (node.type === 'text') {
      console.log(
        ' '.repeat(level * 2) +
          '\x1b[34m' +
          initIndex +
          '\x1b[0m "' +
          node.data.replace(/\n/g, '\\n') +
          '"'
      )
    } else {
      console.log(
        ' '.repeat(level * 2) +
          '\x1b[34m' +
          initIndex +
          ' \x1b[32m<' +
          node.name +
          '>\x1b[0m'
      )
      grabHelper(node.children, level + 1)
    }
  }
}

function grabDepartmentsByBody(body) {
  console.log('grabDepartmentsByBody')
  const $ = cheerio.load(body)
  let departments = {}

  // get departments
  for (let dept of $('select[name=new_dept] option').toArray()) {
    if (TENTATIVE) {
      let parsedDeptNameReg = /^(.+)\(([^\(\)]+)\)$/

      let parsedDeptName = parsedDeptNameReg.exec(dept.children[0].data)
      let deptAbbr = parsedDeptName[2]
      let deptChineseName = parsedDeptName[1]
      let deptEnglishName = deptAbbr

      if (TENTATIVE) {
        deptAbbr = deptAbbr.trim()
      }

      departments[deptAbbr] = {
        abbr: deptAbbr,
        chineseName: deptChineseName,
        englishName: deptEnglishName,
        classes: []
      }
    } else {
      let parsedDeptNameReg = /([A-Z0-9]+) ([^\s]+)(?: (.*))?/
      let parsedDeptName = parsedDeptNameReg.exec(dept.children[0].data)
      let deptAbbr = parsedDeptName[1]
      let deptChineseName = parsedDeptName[2]
      let deptEnglishName = parsedDeptName[3] ? parsedDeptName[3] : deptAbbr

      departments[deptAbbr] = {
        abbr: deptAbbr,
        chineseName: deptChineseName,
        englishName: deptEnglishName,
        classes: []
      }
    }
  }

  // get classes
  for (let cls of $('select[name=new_class] option').toArray()) {
    let parsedClassName = /([A-Z]+)(\s*[0-9A-Z\s]+)\s+([^\s]+)/.exec(
      cls.children[0].data
    )

    let deptAbbr = parsedClassName[1]
    let classLevel = parsedClassName[2]
    let className = parsedClassName[3]

    if (!departments[deptAbbr]) {
      departments[deptAbbr] = {
        abbr: deptAbbr,
        chineseName: className,
        englishName: deptAbbr,
        classes: []
      }
    }
    departments[deptAbbr].classes.push({
      abbr: deptAbbr + classLevel,
      level: classLevel.replace(' ', ''),
      name: className
    })
  }
  return departments
}

function grabCoursesByBody(body) {
  const $ = cheerio.load(body)
  let courses = {}
  // grabHelper($('table#T1 tbody tr'))
  // console.log( $('table#T1 tbody tr').toArray())
  for (let tr of $(
    TENTATIVE ? 'table#T1 tbody tr' : 'table#T1 tbody tr.word'
  ).toArray()) {
    let trArray = $(tr).find('td')
    // console.log(trArray)

    let random = 0
    let canceled = false
    let arguText = ''
    let argus
    try {
      if (!TENTATIVE) {
        let elem = trArray.get(0).children[0].children
        if (elem.length > 5) {
          // random for 5
          arguText = elem[1].attribs.onclick
          random = 5
        } else if (elem.length > 3) {
          // random for 20
          arguText = elem[3].attribs.onclick
          random = 20
        } else if (elem.length > 2) {
          arguText = elem[1].attribs.onclick
        } else {
          arguText = []
          canceled = true
        }

        argus = /[^;]*;checks\(this\.form, '([^']*)','([^']*)','([^']*)','([^']*)','([^']*)','([^']*)','([^']*)','([^']*)','([^']*)','([^']*)','([^']*)'\);/.exec(
          arguText
        )
      } else {
        canceled = false
      }
    } catch (e) {
      grabHelper(tr)
      process.abort()
    }

    try {
      let course
      if (!TENTATIVE) {
        course = {
          number: trArray.get(1).children[0].children[0].data.trim(),
          title: trArray.get(2).children[0].children[0].data.trim(),
          credit: trArray.get(3).children[0].children[0].data.trim(),
          time: $(trArray.get(4))
            .text()
            .trim(),
          room: trArray.get(5).children[0].children[0].data.trim(),
          professor: trArray.get(6).children[0].children[0].data.trim(),
          size_limit: trArray.get(8).children[0].children[0].data.trim(),
          required: trArray.get(7).children[0].children[0].data.trim(),
          previous_size: trArray.get(9).children[0].children[0].data.trim(),
          prerequirement: $(trArray.get(11).children[0])
            .text()
            .trim(),
          memo: $(trArray.get(12).children[0])
            .text()
            .trim(),
          sc_code: !canceled && argus && argus[2],
          sc_div: !canceled && argus && argus[3],
          sc_real: !canceled && argus && argus[4],
          sc_ctime: !canceled && argus && argus[6],
          sc_num: !canceled && argus && argus[7],
          sc_glimit: !canceled && argus && argus[8],
          sc_type: !canceled && argus && argus[9],
          sc_pre: !canceled && argus && argus[10],
          sc_range: !canceled && argus && argus[11],
          random: random,
          canceled: canceled
        }
      } else {
        course = {
          number: $(trArray.get(1))
            .text()
            .trim(),
          title: $(trArray.get(2))
            .text()
            .trim(),
          credit: $(trArray.get(3))
            .text()
            .trim(),
          time: $(trArray.get(4))
            .text()
            .trim(),
          room: $(trArray.get(5))
            .text()
            .trim(),
          professor: $(trArray.get(6))
            .text()
            .trim(),
          required: $(trArray.get(7))
            .text()
            .trim(),
          size_limit: $(trArray.get(8))
            .text()
            .trim(),
          previous_size: 0,
          prerequirement: '',
          memo: $(trArray.get(10))
            .text()
            .trim(),
          random: random,
          canceled: canceled
        }
      }
      courses[course.number] = course
    } catch (error) {
      console.error(error)
      grabHelper(tr)
      process.abort()
    }
  }

  return courses
}

function fillWithEmpty(dept) {
  switch (dept.length) {
    case 4:
      return dept
    case 3:
      return dept + ' '
    case 2:
      return dept + '  '
    case 1:
      return dept + '   '
    default:
      throw new Error('wrong format:', dept)
  }
}

export function grabData(ACIXSTORE) {
  console.log('Starting grabbing data.')

  const url = TENTATIVE
    ? `https://www.ccxp.nthu.edu.tw/ccxp/COURSE/JH/7/7.6/7.6.1/JH761004.php?ACIXSTORE=${ACIXSTORE}`
    : `https://www.ccxp.nthu.edu.tw/ccxp/COURSE/JH/7/7.1/7.1.3/JH713004.php?ACIXSTORE=${ACIXSTORE}`

  const formData = {
    ACIXSTORE: ACIXSTORE,
    toChk: '2',
    new_dept: 'COTM',
    new_class: 'EECS103B',
    keyword: '',
    chks: 'code',
    ckey: '',
    chkbtn: ''
  }

  let data = {
    // 記錄各系所，並在其classes中記錄各班
    departments: {},
    // 紀錄各系、各班所開設課程，僅用`number`連結課程
    catalog: {},
    // 紀錄所有課程
    courses: {}
  }

  request({ method: 'POST', url: url, formData: formData, encoding: null })
    .then(body => {
      if (iconv.decode(body, 'big5') === 'session is interrupted! <br>') {
        console.error('session is interrupted! when request', url)
      }
      data.departments = grabDepartmentsByBody(iconv.decode(body, 'big5'))

      let getDeptData = function(deptAbbr) {
        return new Promise((resolve, reject) => {
          // get dept's courses
          request({
            method: 'POST',
            url: url,
            formData: {
              ACIXSTORE: ACIXSTORE,
              toChk: '1',
              new_dept: TENTATIVE ? fillWithEmpty(deptAbbr) : deptAbbr,
              new_class: 'IEEM105B',
              chks: TENTATIVE ? 'dept' : '%C1%60%BF%FD'
            },
            encoding: null
          })
            .then(body => {
              if (
                iconv.decode(body, 'big5') === 'session is interrupted! <br>'
              ) {
                console.error(
                  'session is interrupted! when request new_dept',
                  deptAbbr
                )
              }
              let courses = grabCoursesByBody(iconv.decode(body, 'big5'))
              for (let courseNumber in courses) {
                if (!data.catalog[deptAbbr]) {
                  data.catalog[deptAbbr] = []
                }
                data.catalog[deptAbbr].push(courseNumber)

                if (!data.courses[courseNumber]) {
                  data.courses[courseNumber] = courses[courseNumber]
                }
              }
              resolve()
              console.log(
                'DEPT ',
                deptAbbr,
                data.catalog[deptAbbr]
                  ? data.catalog[deptAbbr].length
                  : 'EMPTY',
                Object.keys(data.courses).length
              )
              console.log(
                data.catalog[deptAbbr] ? data.catalog[deptAbbr][0] : ''
              )
            })
            .catch(err => {
              console.error(err)
              reject(err)
            })
        })
      }

      let getClassData = function(classAbbr) {
        return new Promise((resolve, reject) => {
          request({
            method: 'POST',
            url: url,
            formData: {
              ACIXSTORE: ACIXSTORE,
              toChk: '2',
              new_class: classAbbr,
              chks: TENTATIVE ? 'code' : '',
              new_dept: 'ENE '
            },
            encoding: null
          })
            .then(body => {
              if (
                iconv.decode(body, 'big5') === 'session is interrupted! <br>'
              ) {
                console.error(
                  'session is interrupted! when request new_class',
                  classAbbr
                )
              }
              let courses = grabCoursesByBody(iconv.decode(body, 'big5'))
              for (let courseNumber in courses) {
                if (!data.catalog[classAbbr]) {
                  data.catalog[classAbbr] = []
                }
                data.catalog[classAbbr].push(courseNumber)
                // console.log(classAbbr)
                // console.log(data.catalog[classAbbr])

                if (!data.courses[courseNumber]) {
                  data.courses[courseNumber] = courses[courseNumber]
                }
              }
              resolve()
              console.log(
                'CLASS',
                classAbbr,
                data.catalog[classAbbr]
                  ? data.catalog[classAbbr].length
                  : 'EMPTY',
                Object.keys(data.courses).length
              )
              console.log(
                data.catalog[classAbbr] ? data.catalog[classAbbr][0] : ''
              )
            })
            .catch(err => {
              console.error(err)
              reject(err)
            })
        })
      }

      let poolLimit = 5
      asyncPool(poolLimit, Object.keys(data.departments), getDeptData)
        .then(() => {
          let classList = []
          for (let deptAbbr in data.departments) {
            // get class courses
            for (let cls of data.departments[deptAbbr].classes) {
              classList.push(cls.abbr)
            }
          }
          return asyncPool(poolLimit, classList, getClassData)
        })
        .then(() => {
          console.log('Grabbing Data is done!')

          return new Promise((resolve, reject) => {
            let jsonStr = JSON.stringify(data, null, '  ')
            if (jsonStr.length < 1000) {
              throw new Error('GrabData: Grabbing Data Failed!')
            }

            fs.writeFile(
              `${__dirname}/courses_db.${Date.now()}.json`,
              jsonStr,
              'utf8',
              err => {
                if (err) {
                  console.log(err)
                  reject(err)
                }
                console.log(
                  'Write in to file',
                  `${__dirname}/courses_db.${Date.now()}.json`
                )
                resolve(data)
              }
            )
          })
        })
        .then(data => {
          let jsonStr = JSON.stringify(data)
          return new Promise((resolve, reject) => {
            fs.writeFile(
              `${__dirname}/courses_db.json`,
              jsonStr,
              'utf8',
              err => {
                if (err) {
                  console.log(err)
                  reject(err)
                }
                resolve(jsonStr)
                console.log('Write in to file', `${__dirname}/courses_db.json`)
              }
            )
          })
        })
        .catch(err => {
          console.error(err)
        })
    })
    .catch(err => {
      console.error(err)
    })
}

grabData('f3dn85k1dvu2ap28vkjseljtl3')
