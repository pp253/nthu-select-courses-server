export const ResponseJSON = (obj) => {
  return Object.assign({
    error: 0,
    time: Date.now()
  }, obj)
}

export const ResponseSuccessJSON = (obj) => {
  return Object.assign(ResponseJSON({
    success: 1
  }), obj)
}

export const ResponseErrorJSON = (obj) => {
  return Object.assign(ResponseJSON({
    error: 1,
    id: 0,
    msg: 'Unknown error.'
  }), obj)
}

export const ResponseErrorMsg = {
  // api/
  ApiModuleNotExist (moduleName) {
    return ResponseErrorJSON({
      id: 1,
      msg: `ModuleName='${moduleName}' is not exist.`
    })
  },
  ApiArgumentValidationError (errMsg) {
    return ResponseErrorJSON({
      id: 3,
      msg: `Arguments not match.`,
      more: errMsg
    })
  },
  // api/user/
  UserInfoNotCorrect (errMsg) {
    return ResponseErrorJSON({
      id: 20,
      msg: `User name or password is not correct.`,
      more: errMsg
    })
  },
  AuthCheckCodeNotCorrect (errMsg) {
    return ResponseErrorJSON({
      id: 21,
      msg: `Auth check code is not correct.`,
      more: errMsg
    })
  },
  NTHUServerError (errMsg) {
    return ResponseErrorJSON({
      id: 22,
      msg: `NTHU server responses with an error.`,
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
