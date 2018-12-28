export function ResponseJSON(obj) {
  return Object.assign(
    {
      error: 0,
      time: Date.now()
    },
    obj
  )
}

export function ResponseSuccessJSON(obj) {
  return Object.assign(
    ResponseJSON({
      success: 1
    }),
    obj
  )
}

export function ResponseErrorJSON(obj) {
  return Object.assign(
    ResponseJSON({
      error: 1,
      id: 0,
      msg: 'Unknown error.'
    }),
    obj
  )
}

export const ResponseErrorMsg = {
  // api/
  ApiModuleNotExist(moduleName) {
    return ResponseErrorJSON({
      id: 1,
      msg: `ModuleName='${moduleName}' is not exist.`
    })
  },
  ApiArgumentValidationError(errMsg) {
    return ResponseErrorJSON({
      id: 3,
      msg: `Arguments not match.`,
      more: errMsg
    })
  },
  // api/user/
  UserInfoNotCorrect(errMsg) {
    return ResponseErrorJSON({
      id: 20,
      msg: `User name or password is not correct.`,
      more: errMsg
    })
  },
  AuthCheckCodeNotCorrect(errMsg) {
    return ResponseErrorJSON({
      id: 21,
      msg: `Auth check code is not correct.`,
      more: errMsg
    })
  },
  NTHUServerError(errMsg) {
    return ResponseErrorJSON({
      id: 22,
      msg: `NTHU server responses with an error.`,
      more: errMsg
    })
  },
  SessionInterrupted() {
    return ResponseErrorJSON({
      id: 23,
      msg: `Session is interrupted.`
    })
  },
  // api/select_course
  CourseNotFound(errMsg) {
    return ResponseErrorJSON({
      id: 30,
      msg: `Course not found in database.`,
      more: errMsg
    })
  },
  CourseCanceled(errMsg) {
    return ResponseErrorJSON({
      id: 31,
      msg: `Course is canceled.`,
      more: errMsg
    })
  },
  DuplicatedCourse(errMsg) {
    return ResponseErrorJSON({
      id: 32,
      msg: `Course was taken before.`,
      more: errMsg
    })
  },
  CoursesTimeConflict(errMsg) {
    return ResponseErrorJSON({
      id: 33,
      msg: `Time Conflict.`,
      more: errMsg
    })
  },
  SameCourse(errMsg) {
    return ResponseErrorJSON({
      id: 34,
      msg: `Same course has been selected.`,
      more: errMsg
    })
  },
  ViolatePrerequisite(errMsg) {
    return ResponseErrorJSON({
      id: 35,
      msg: `Violate course prerequisite.`,
      more: errMsg
    })
  },
  OtherError(errMsg) {
    return ResponseErrorJSON({
      id: 36,
      msg: `Other error, see more.`,
      more: errMsg
    })
  },
  NotAvailable(errMsg) {
    return ResponseErrorJSON({
      id: 37,
      msg: `The NTHU select courses system is not available now.`,
      more: errMsg
    })
  },
  NotValidCourseNumber(errMsg) {
    return ResponseErrorJSON({
      id: 38,
      msg: `The course number is not valid.`,
      more: errMsg
    })
  },
  NewOrderMoreThanOldOrder(errMsg) {
    return ResponseErrorJSON({
      id: 39,
      msg: `New order cannot more than old order.`,
      more: errMsg
    })
  },
  NewOrderNotEmpty(errMsg) {
    return ResponseErrorJSON({
      id: 40,
      msg: `New order cannot has empty element.`,
      more: errMsg
    })
  },
  OldOrderIncludesAllInNewOrder(errMsg) {
    return ResponseErrorJSON({
      id: 41,
      msg: `Old order must includes all elements in new order.`,
      more: errMsg
    })
  },
  ViolateCourseRule(errMsg) {
    return ResponseErrorJSON({
      id: 42,
      msg: `Violate course rule.`,
      more: errMsg
    })
  }
}

export default {
  ResponseJSON,
  ResponseSuccessJSON,
  ResponseErrorJSON,
  ResponseErrorMsg
}
