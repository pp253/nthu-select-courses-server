define({ "api": [
  {
    "type": "post",
    "url": "api/select_course/addCourse",
    "title": "Add course",
    "name": "addCourse",
    "group": "Select_Courses",
    "description": "<p>This method is only available in selection period.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "sessionToken",
            "description": "<p>Session token.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "courseNumber",
            "description": "<p>Course number.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "order",
            "defaultValue": "0",
            "description": "<p>Order.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example",
          "content": "{\n  sessionToken: 'ifgqu3iupvrrts8fp4tpov1cm5',\n  courseNumber: '10610GE  150300',\n  order: 0\n}",
          "type": "Object"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "CurrentSelectedCourses",
            "optional": false,
            "field": "currentSelectedCourses",
            "description": "<p>Current Selected Courses.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  error: 0,\n  time: 1517335710534,\n  success: 1,\n  currentSelectedCourses: [\n    {\n      number: '10610GE  150300',\n      status: 0, // 0: 未選上, 1: 已選上, 2: 亂數中\n      orderCatalog: '', // '', '通', '中', or '體'.\n      order: '' // 0: not waiting for random process, 1~20: order\n    }\n  ]\n}",
          "type": "Object"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/select-course.js",
    "groupTitle": "Select_Courses"
  },
  {
    "type": "post",
    "url": "api/select_course/editOrder",
    "title": "Edit order",
    "name": "editOrder",
    "group": "Select_Courses",
    "description": "<p>This method is only available in selection period.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "sessionToken",
            "description": "<p>Session token.</p>"
          },
          {
            "group": "Parameter",
            "type": "Course[]",
            "optional": false,
            "field": "newOrder",
            "description": "<p>Course number.</p>"
          },
          {
            "group": "Parameter",
            "type": "Course[]",
            "optional": false,
            "field": "oldOrder",
            "description": "<p>Course number.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example",
          "content": "{\n  sessionToken: 'ifgqu3iupvrrts8fp4tpov1cm5',\n  newOrder: [],\n  oldOrder: []\n}",
          "type": "Object"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "CourseStatus[]",
            "optional": false,
            "field": "currentSelectedCourses",
            "description": "<p>Current Selected Courses.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  error: 0,\n  time: 1517335710534,\n  success: 1,\n  currentSelectedCourses: [\n    {\n      number: '10610GE  150300',\n      status: 0, // 0: 未選上, 1: 已選上, 2: 亂數中\n      orderCatalog: '', // '', '通', '中', or '體'.\n      order: '' // 0: not waiting for random process, 1~20: order\n    }\n  ]\n}",
          "type": "Object"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/select-course.js",
    "groupTitle": "Select_Courses"
  },
  {
    "type": "post",
    "url": "api/select_course/getAvailableSelectionResult",
    "title": "Get available selection result",
    "name": "getAvailableSelectionResult",
    "group": "Select_Courses",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "sessionToken",
            "description": "<p>Session token.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example",
          "content": "{\n  sessionToken: 'ifgqu3iupvrrts8fp4tpov1cm5'\n}",
          "type": "Object"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "AvailableSelectionResult",
            "optional": false,
            "field": "availableSelectionResult",
            "description": "<p>Available selection result.</p>"
          },
          {
            "group": "200",
            "type": "Semester",
            "optional": false,
            "field": "semester",
            "description": "<p>Semester.</p>"
          },
          {
            "group": "200",
            "type": "Phase",
            "optional": false,
            "field": "phase",
            "description": "<p>Phase.</p>"
          },
          {
            "group": "200",
            "type": "Boolean",
            "optional": false,
            "field": "editable",
            "description": "<p>Editable.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  error: 0,\n  time: 1517335710534,\n  success: 1,\n  availableSelectionResult: {\n    '10610': [\n      '100',\n      '100P'\n    ]\n  },\n  semester: '',\n  phase: '',\n  editable: false\n}",
          "type": "Object"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/select-course.js",
    "groupTitle": "Select_Courses"
  },
  {
    "type": "post",
    "url": "api/select_course/getCurrentSelectedCourses",
    "title": "Get current selected courses",
    "name": "getCurrentSelectedCourses",
    "group": "Select_Courses",
    "description": "<p>This method is only available in selection period.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "sessionToken",
            "description": "<p>Session token.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example",
          "content": "{\n  sessionToken: 'ifgqu3iupvrrts8fp4tpov1cm5'\n}",
          "type": "Object"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "CurrentSelectedCourses",
            "optional": false,
            "field": "currentSelectedCourses",
            "description": "<p>Current Selected Courses.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  error: 0,\n  time: 1517335710534,\n  success: 1,\n  currentSelectedCourses: [\n    {\n      number: '10610GE  150300',\n      status: 0, // 0: 未選上, 1: 已選上, 2: 亂數中\n      orderCatalog: '', // '', '通', '中', or '體'.\n      order: '' // 0: not waiting for random process, 1~20: order\n    }\n  ]\n}",
          "type": "Object"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/select-course.js",
    "groupTitle": "Select_Courses"
  },
  {
    "type": "post",
    "url": "api/select_course/getSelectionResult",
    "title": "Get selection result",
    "name": "getSelectionResult",
    "group": "Select_Courses",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "SessionToken",
            "optional": false,
            "field": "sessionToken",
            "description": "<p>Session token.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "semester",
            "description": "<p>Semester. Available semester and phase could be obtained by <code>select_course/getAvailableSelectionResult</code>.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phase",
            "description": "<p>Phase.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example",
          "content": "{\n  sessionToken: 'ifgqu3iupvrrts8fp4tpov1cm5',\n  semester: '10610', // 106學年度上學期\n  phase: '101P' // 第二次選課亂數後結果\n}",
          "type": "Object"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "semester",
            "description": "<p>Semester.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "phase",
            "description": "<p>Phase.</p>"
          },
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "status",
            "description": "<p>Selection result.</p>"
          },
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "randomFailed",
            "description": "<p>Courses that failed for enrollment.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  error: 0,\n  time: 1517335710534,\n  success: 1,\n  semester: '10610',\n  phase: '101P',\n  status: [{\n    number: '',\n    title: '',\n    credit: '',\n    time: '',\n    room: '',\n    professor: '',\n    size_limit: ''\n  }],\n  randomFailed: [{\n    number: '',\n    title: '',\n    credit: '',\n    time: '',\n    room: '',\n    professor: '',\n    size_limit: '',\n    reason: ''\n  }]\n}",
          "type": "Object"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/select-course.js",
    "groupTitle": "Select_Courses"
  },
  {
    "type": "post",
    "url": "api/select_course/getSyllabus",
    "title": "Get syllabus",
    "name": "getSyllabus",
    "group": "Select_Courses",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "sessionToken",
            "description": "<p>Session token.</p>"
          },
          {
            "group": "Parameter",
            "type": "CourseNumber",
            "optional": false,
            "field": "courseNumber",
            "description": "<p>Course number.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example",
          "content": "{\n  sessionToken: 'ifgqu3iupvrrts8fp4tpov1cm5',\n  courseNumber: '10610GE  150300',\n}",
          "type": "Object"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Syllabus",
            "optional": false,
            "field": "syllabus",
            "description": "<p>Syllabus.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  error: 0,\n  time: 1517335710534,\n  success: 1,\n  syllabus: {\n   number: '10610GE  150300',\n   chineseTitle: '',\n   englishTitle: '',\n   credit: '',\n   time: '',\n   room: '',\n   professor: '',\n   size_limit: '',\n   briefDescription: '',\n   description: '',\n   file: false\n  }\n}",
          "type": "Object"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/select-course.js",
    "groupTitle": "Select_Courses"
  },
  {
    "type": "post",
    "url": "api/select_course/quitCourse",
    "title": "Quit course",
    "name": "quitCourse",
    "group": "Select_Courses",
    "description": "<p>This method is only available in selection period.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "sessionToken",
            "description": "<p>Session token.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "courseNumber",
            "description": "<p>Course number.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example",
          "content": "{\n  sessionToken: 'ifgqu3iupvrrts8fp4tpov1cm5',\n  courseNumber: '10610GE  150300'\n}",
          "type": "Object"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "CurrentSelectedCourses",
            "optional": false,
            "field": "currentSelectedCourses",
            "description": "<p>Current Selected Courses.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  error: 0,\n  time: 1517335710534,\n  success: 1,\n  currentSelectedCourses: [\n    {\n      number: '10610GE  150300',\n      status: 0, // 0: 未選上, 1: 已選上, 2: 亂數中\n      orderCatalog: '', // '', '通', '中', or '體'.\n      order: '' // 0: not waiting for random process, 1~20: order\n    }\n  ]\n}",
          "type": "Object"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/select-course.js",
    "groupTitle": "Select_Courses"
  },
  {
    "type": "post",
    "url": "api/scores/getDistribution",
    "title": "Get distribution",
    "name": "getDistribution",
    "group": "scores",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "SessionToken",
            "optional": false,
            "field": "sessionToken",
            "description": "<p>Session token.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example",
          "content": "{\n  sessionToken: 'ifgqu3iupvrrts8fp4tpov1cm5',\n  courseNumber: '10610GE  150300'\n}",
          "type": "Object"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "distribution",
            "description": "<p>Performance distribution of a course.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  error: 0,\n  time: 1517335710534,\n  success: 1,\n  distribution:  {\n    A: 35,\n    A+: 33,\n    A-: 6,\n    B: 1,\n    B+: 1\n    B-: 0,\n    C: 0,\n    C+: 0,\n    C-: 0,\n    D: 0,\n    E: 1,\n    X: 0,\n    not_yet: 0,\n    total: 77\n  }\n}",
          "type": "Object"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/scores.js",
    "groupTitle": "scores"
  },
  {
    "type": "post",
    "url": "api/scores/getScores",
    "title": "Get scores",
    "name": "getScores",
    "group": "scores",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "SessionToken",
            "optional": false,
            "field": "sessionToken",
            "description": "<p>Session token.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example",
          "content": "{\n  sessionToken: 'ifgqu3iupvrrts8fp4tpov1cm5'\n}",
          "type": "Object"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "scores",
            "description": "<p>Enrolled courses seperated by semesters.</p>"
          },
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "courses",
            "description": "<p>Enrolled courses' full information.</p>"
          },
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "overview",
            "description": "<p>Overall status of a student.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  error: 0,\n  time: 1517335710534,\n  success: 1,\n  \"scores\": {\n    \"10510\": [\n      \"10510CL  101023\",\n      \"10510E   100102\"\n    ],\n    \"10520\": [\n      \"10520CS  135601\",\n      \"10520EE  206000\"\n    ]\n  },\n  \"courses\": {\n    \"10520CS  135601\": {\n      \"semester\": \"10520\",\n      \"courseNumber\": \"10520CS  135601\",\n      \"courseTitle\": \"計算機程式設計二\",\n      \"credit\": \"3\",\n      \"grade\": \"A+\"\n    },\n    \"10520EE  206000\": {\n      \"semester\": \"10520\",\n      \"courseNumber\": \"10520EE  206000\",\n      \"courseTitle\": \"離散數學\",\n      \"credit\": \"3\",\n      \"grade\": \"B+\"\n    },\n    \"10510CL  101023\": {\n      \"semester\": \"10510\",\n      \"courseNumber\": \"10510CL  101023\",\n      \"courseTitle\": \"大學中文\",\n      \"credit\": \"2\",\n      \"grade\": \"A\"\n    },\n    \"10510E   100102\": {\n      \"semester\": \"10510\",\n      \"courseNumber\": \"10510E   100102\",\n      \"courseTitle\": \"工程導論\",\n      \"credit\": \"2\",\n      \"grade\": \"B-\"\n    }\n  },\n  \"overview\": {\n    \"10510\": {\n      \"semester\": \"10510\",\n      \"gpa\": \"4.29\",\n      \"credit\": \"22\",\n      \"deservedCredit\": \"22\",\n      \"courses\": \"12\",\n      \"summerVacationCredit\": \"0\",\n      \"transferCredit\": \"0\",\n      \"classRanking\": \"1/63\",\n      \"departmentRanking\": \"1/63\",\n      \"comments\": \"\"\n    },\n    \"10520\": {\n      \"semester\": \"10520\",\n      \"gpa\": \"1.72\",\n      \"credit\": \"24\",\n      \"deservedCredit\": \"24\",\n      \"courses\": \"10\",\n      \"summerVacationCredit\": \"0\",\n      \"transferCredit\": \"0\",\n      \"classRanking\": \"2/63\",\n      \"departmentRanking\": \"2/63\",\n      \"comments\": \"\"\n    }\n  }\n}",
          "type": "Object"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/scores.js",
    "groupTitle": "scores"
  },
  {
    "type": "post",
    "url": "api/user/getLoginToken",
    "title": "Get login token",
    "name": "getLoginToken",
    "group": "user",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "LoginToken",
            "optional": false,
            "field": "loginToken",
            "description": "<p>Login token is used to mapping with authentication image.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "authImg",
            "description": "<p>An image encoded in <code>base64</code>.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  error: 0,\n  time: 1517335710534,\n  success: 1,\n  loginToken: '20180131-985013778448',\n  authImg: 'iVBORw0KGgoAAAANSUhEUgAAAFAAAAAeCAMAAACMnWmDAAABFFBMVEX///8yMv/8uLyw78TGxeO70verw8XPzuPU+rHdodjmyNCi5cK/pfT/tMO8t6z1q6m0tNbG58T1qOba6qIjLHJ1e6Y+RoNaYJU1PX5rcKRKSpKAJ43v5PCveLe9z72fXamrn6+/k8bfyeKPQpuVW5afdpq0qqOqkJ+/xajPrtQDEJbf4fHAw+QiLaNCS7Bhab2gpdfAi7dCOaFhTaagdrKBh8qBYqxen1muz6yR0ZtoqWa5wNHq8+qFrYxro2rW59Wftq+Ssp6Gt4Jyq23C28Caw5cliobj8O/I4eCSxMJbp6Snnput09F2tbNAmJXBoqBpXULGwrjs6uehmYi0rqDZ1s+OhXF7cVmdeX+Mb2vAi6jjntHhVwF8AAACg0lEQVRIie2UaW/aQBCGV5BECDDmcJu2C6UJ6cFy9qDrNqSkAYztYnc5Epr0//+P7m2boCBV+ZhXI3l2wI/endk1AE960mOoVGKxRzPX83+ZwDRpvljuJT7Mc+dB6FB5JuetyELUDw9Z7MKVtpHpNAspDnN877fJtSZkDRRxBw9Ua6/vO0yn07Yt88AJ5y7PmMNrQshK4eLEZ89lUodvYj1stQUu/Q1/l6W54/N9uybr4XK1IDcgm2WR4FmWSGoQnkTOWp0Ofx6cY4yHouZSoMf2HQqfS7IBFJdN9PDYksBT2ID1GA8hseML/AOPRHHmhBQXBr7juBKYFYr16MVLyyqKDlKkLncRQi1m8ODy8gL/lFU2kzl9ek7I14QIhwkVpcNMBkCoq71+hwM5El/Jaih4LOEWN2QpehjDFSmwWBTEM3iq6obRRR8FD5zjsaz6fCqAzZuDb8g1uCfpMEP1Fr7TZeMTaqt8rKYyD2Yi8RyPPfTJVqpUaMgeUuR7WNMGjc/oiyFXV3iy5UIC1/pkR8RKyrJSKc4DH2JjpsC+ym1sb70Xii1vAytcFCjX1WjMhjFAX9VipKcCXGlQTHlB/pRBubzDoUQ2YFX/NEADlQ4xllng+DPgBnLYyzXZ3N4leSDukF4+PWbQRz2dj6O7IiR4hOm2nLAIgOoh0wk80Rb7qKv/M8X2RCBd+v0KPTnr1Wq9uPvLcYVCRKTHJp9nAZp1CPWg2xHQHtP7PAW7VFY91ER2l63jPONVKQ42mqLe6qPOQJzEEcWNp8OdQKlCIQl8lWcCzWbUQsQkPjhgMnoIppAyyeVYcIcJ9bq93qC9/dp+HiPmVA8fQzkhvT46YvFf+gelEmXM12SvVQAAAABJRU5ErkJggg=='\n}",
          "type": "Object"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/user.js",
    "groupTitle": "user"
  },
  {
    "type": "post",
    "url": "api/user/getSessionToken",
    "title": "Get session token",
    "name": "getSessionToken",
    "group": "user",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>User name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userpass",
            "description": "<p>User password.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "authCheckCode",
            "description": "<p>Authentication check code showed on <code>authImg</code> provided by <code>getLoginToken</code>.</p>"
          },
          {
            "group": "Parameter",
            "type": "LoginToken",
            "optional": false,
            "field": "loginToken",
            "description": "<p>Login token provided by <code>getLoginToken</code>.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example",
          "content": "{\n  username: '100090009',\n  userpass: 'my_password',\n  authCheckCode: '123456',\n  loginToken: '20180131-985013778448'\n}",
          "type": "Object"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "SessionToken",
            "optional": false,
            "field": "sessionToken",
            "description": "<p>Session token.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>User name.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  error: 0,\n  time: 1517335710534,\n  success: 1,\n  sessionToken: 'ifgqu3iupvrrts8fp4tpov1cm5',\n  username: '100090009'\n}",
          "type": "Object"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/user.js",
    "groupTitle": "user"
  },
  {
    "type": "post",
    "url": "api/user/logout",
    "title": "Logout",
    "name": "logout",
    "group": "user",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "sessionToken",
            "description": "<p>Session token.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example",
          "content": "{\n   sessionToken: 'ifgqu3iupvrrts8fp4tpov1cm5'\n}",
          "type": "Object"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  error: 0,\n  time: 1517335710534,\n  success: 1\n}",
          "type": "Object"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/user.js",
    "groupTitle": "user"
  }
] });
