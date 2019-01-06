export default {
  grabdata: {
    nthuBase: 'https://www.ccxp.nthu.edu.tw/ccxp/COURSE/',
    authImg:
      'https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/auth_img.php?pwdstr={0}',
    authPage: 'https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/pre_select_entry.php',
    inquirePage: 'https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/',
    selectPage:
      'https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/select_entry.php?ACIXSTORE={0}&hint={1}',
    preloadSelectedCoursesPage0:
      'https://www.ccxp.nthu.edu.tw/ccxp/COURSE/JH/7/7.1/7.1.3/JH713001.php?ACIXSTORE={0}',
    preloadSelectedCoursesPage1:
      'https://www.ccxp.nthu.edu.tw/ccxp/COURSE/JH/7/7.1/7.1.3/JH7130011.php',
    preloadSelectedCoursesPage2:
      'https://www.ccxp.nthu.edu.tw/ccxp/COURSE/JH/7/7.1/7.1.3/JH713002.php?ACIXSTORE={0}',
    teacherPasswordPage:
      'https://www.ccxp.nthu.edu.tw/ccxp/COURSE/JH/7/7.1/7.1.3/JH713003.php?ACIXSTORE={0}&ts_pwd={1}',
    preSelectCoursesPage:
      'https://www.ccxp.nthu.edu.tw/ccxp/COURSE/JH/7/7.1/7.1.3/JH7130041.php',
    preSelectCoursesRefererPage:
      'https://www.ccxp.nthu.edu.tw/ccxp/COURSE/JH/7/7.1/7.1.3/JH713004.php?ACIXSTORE={0}',
    currentSelectedCoursesPage:
      'https://www.ccxp.nthu.edu.tw/ccxp/COURSE/JH/7/7.1/7.1.3/JH713005.php?ACIXSTORE={0}',
    scoresPage:
      'https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/JH/8/R/6.3/JH8R63002.php?ACIXSTORE={0}',
    syllabusPage:
      'https://www.ccxp.nthu.edu.tw/ccxp/COURSE/JH/common/Syllabus/1.php?ACIXSTORE={0}&c_key={1}',
    syllabusFilePage:
      'https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/JH/output/6_6.1_6.1.12/{0}.pdf',
    distributionPage:
      'https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/JH/8/8.3/8.3.3/JH83302.php?ACIXSTORE={0}&c_key={1}',
    selectionResultPage:
      'https://www.ccxp.nthu.edu.tw/ccxp/COURSE/JH/7/7.2/7.2.1/JH721002.php',
    selectionResultDetailPage:
      'https://www.ccxp.nthu.edu.tw/ccxp/COURSE/JH/7/7.2/7.2.1/JH721003.php',
    logoutPage:
      'https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/logout.php?ACIXSTORE={0}',
    waitingForRandomProcessText: '未亂數(Wait for random process)',
    infoWaitingForRandomProcess:
      "<script>alert('加選此科目僅列入亂數處理!\\nThis course has size limit.\\nThe system will run randomly to decide who will be enrolled in the course after the end of this course selection period.');</script>",
    infoSyllabusIsFile: '觀看上傳之檔案',
    errSystemErrorText: "<script>alert('System Error!');</script>",
    errAuthCheckCodeWrongText:
      "<script>alert('Authentication ID Error!');</script>",
    errUserInfoWrongText:
      "<script>alert('Error account or password!');</script>",
    errSessionInterrupted: 'session is interrupted! <br>',
    errDuplicatedCourse:
      "<script>alert('重複修讀!\\nYou have taken this course before！');</script>",
    errCoursesTimeConflict:
      "<script>alert('衝堂!選一般科目，不得與任一科目衝。選志願科目，只能與同類科目衝\\nTime Conflict！');</script>",
    errSameCourse: "<script>alert('您已加選過此課程!');</script>",
    errNotValid: "<script>alert('無效的加選')",
    errViolatePrerequisite:
      "<script>alert('擋修!\\nViolate the Prerequisite！');</script>",
    errNotAvailable: "<script>alert('目前非選課階段",
    errWrongPE: "<script>alert('體育課程曾不及格才能修兩門!",
    errCantAddCourse: "<script>alert('本課程人限為零，請見課程備註了解加選方式",
    errWaitingForThirdPhase: "<script>alert('本階段原修者優，第三次選課即開放，不再設限",
    errNotValidCourseNumber: '錯誤的科目',
    errGeneralCoursesNotMoreThanThree: '<script>alert(\'通識課一學期最多三科!',
    warnCantBeGE: "<script>alert('您選此課程只能當必選修，不能當通識!');</script>"
  }
}
