const coursesDB = require('./courses_db.json')

for (let courseNumber in coursesDB.courses) {
  let course = coursesDB.courses[courseNumber]
  if (course.random > 1) {
    console.log(courseNumber)
  }
}
