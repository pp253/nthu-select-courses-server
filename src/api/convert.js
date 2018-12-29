const fs = require('fs')

const openCourseData = require('./open_course_data.json')
const coursesDB = require('./courses_db.json')
let geDegreeTypes = []
let languageTypes = []
let doubleTypes = []
let programTypes = []
let requiredTypes = []
let courses = {}

for (let course of openCourseData) {
  let number = course['科號']
  let data = {
    number: number,
    title: course['課程中文名稱'],
    title_eng: course['課程英文名稱'],
    credit: parseInt(course['學分數']),
    random: (number in coursesDB.courses && coursesDB.courses[number].random) || 0
  }

  if (course['授課教師']) {
    data.professor = course['授課教師'].trim().split('\n')
  }
  if (course['人限']) {
    data.size_limit = parseInt(course['人限'])
  }
  if (course['新生保留人數']) {
    data.reserved = parseInt(course['新生保留人數'])
  }
  if (course['教室與上課時間']) {
    data.room = course['教室與上課時間'].trim().split('\t')[0]
    data.time = course['教室與上課時間'].trim().split('\t')[1]
  }
  if (course['擋修說明']) {
    data.prerequirement = course['擋修說明'].trim()
  }
  if (course['課程限制說明']) {
    data.course_rule = course['課程限制說明'].trim()
  }
  if (course['備註']) {
    data.memo = course['備註'].trim()
  }

  if (course['通識類別']) {
    data.ge_degree = course['通識類別'].trim()
    if (!geDegreeTypes.includes(course['通識類別'].trim())) {
      geDegreeTypes.push(course['通識類別'].trim())
    }
  }
  if (course['通識對象']) {
    data.ge_object = course['通識對象'].trim()
  }
  if (course['授課語言']) {
    data.language = course['授課語言'].trim()
    if (!languageTypes.includes(course['授課語言'].trim())) {
      languageTypes.push(course['授課語言'].trim())
    }
  }
  if (course['必選修說明']) {
    data.required = course['必選修說明'].trim().split('\t')
    for (let type of course['必選修說明'].trim().split('\t')) {
      if (!requiredTypes.includes(type)) {
        requiredTypes.push(type)
      }
    }
  }
  if (course['學分學程對應']) {
    data.program = course['學分學程對應'].trim().split('/')
    for (let type of course['學分學程對應'].trim().split('/')) {
      if (!programTypes.includes(type)) {
        programTypes.push(type)
      }
    }
  }
  if (course['第一二專長對應']) {
    data.double = course['第一二專長對應'].trim().split('\t')
    for (let type of course['第一二專長對應'].trim().split('\t')) {
      if (!doubleTypes.includes(type)) {
        doubleTypes.push(type)
      }
    }
  }
  if (course['不可加簽說明']) {
    data.add = course['不可加簽說明'].trim()
  }

  courses[number] = data
}

// verify
for (let c in coursesDB.courses) {
  if (!(c in courses)) {
    console.error(c, 'not in courses.')

    if (coursesDB.courses[c].professor) {
      coursesDB.courses[c].professor = [coursesDB.courses[c].professor]
      console.log('convert!')
    }

    if (coursesDB.courses[c].required) {
      coursesDB.courses[c].required = undefined
      console.log('convert required!')
    }
  }
}

coursesDB.courses = Object.assign({}, coursesDB.courses, courses)
coursesDB.geDegreeTypes = geDegreeTypes
coursesDB.languageTypes = languageTypes
coursesDB.doubleTypes = doubleTypes
coursesDB.programTypes = programTypes
coursesDB.requiredTypes = requiredTypes

let jsonStr = JSON.stringify(coursesDB, null, '  ')
let filepath = `${__dirname}/courses_db.refined.json`
fs.writeFile(filepath,
  jsonStr,
  'utf8',
  err => {
    if (err) {
      throw err
    }
    console.log('Write in to file', filepath)
  }
)

jsonStr = JSON.stringify(coursesDB)
filepath = `${__dirname}/courses_db.min.json`
fs.writeFile(filepath,
  jsonStr,
  'utf8',
  err => {
    if (err) {
      throw err
    }
    console.log('Write in to file', filepath)
  }
)
