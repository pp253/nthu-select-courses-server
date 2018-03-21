# Type Definition

## `DepartmentAbbr` _String_

4 english characters to represent a department. Such as `IEEM` for 工工系, and `CS` for 資工系.

## `ClassAbbr` _String_

`ClassAbbr` is `DepartmentAbbr` + `Level`. Such as `BMES106M` for 醫環系碩士班.

## `Level` _String_

`Level` is `3 digit of 民國年分` + (B: 大學部, M: 碩士班, D: 博士班) + (分班)?

```js
let REG = /^\d{3}[BMD][A-Z]?$/
```

For instance, `106D` is doctoral class for 民國 106 年, and `106BA` is `A` class for undergraduate student.

> 但是物理系似乎有在 `Level` 中間包含空格的樣子。

## `CourseNumber` _String_

`CourseNumber` is `Semester` + `ShortCourseNumber`. Such as `10610IEEM233010`.

## `ShortCourseNumber` _String_

`ShortCourseNumber` is `DepartmentAbbr` + its course code. Such as `IEEM233010`.

## `Semester` _String_

| Semester        | Code |
| --------------- | ---- |
| First semester  | 10   |
| Second semester | 20   |
| Summer semester | 30   |

Combine the 3 digit 民國年分 (99 年=099) with `semester code` to represent specific semester of the year.

### Example

```
10630
```

## `Phase` _String_

| Phase           | Code   |
| --------------- | ------ |
| 第 1 次選課紀錄 | `100`  |
| 第 1 次選課結果 | `100P` |
| 第 2 次選課紀錄 | `101`  |
| 第 2 次選課結果 | `101P` |
| 新生選課紀錄    | `500`  |
| 新生選課結果    | `500P` |
| 第 3 次選課紀錄 | `200`  |
| 第 3 次選課結果 | `200P` |
| 開學前選課結果  | `200S` |
| 加退選紀錄      | `300`  |
| 加退選結果      | `300P` |
| 二退紀錄        | `400`  |
| 二退結果        | `400P` |

## `Time` _String_

| Weekday   | Code |
| --------- | ---- |
| Monday    | `M`  |
| Thusday   | `T`  |
| Wednesday | `W`  |
| Thursday  | `R`  |
| Friday    | `F`  |
| Saturday  | `S`  |

| Period | Code          |
| ------ | ------------- |
| 1~4    | `1` ~ `4`     |
| Noon   | `n`           |
| 5~9    | `5` ~ `9`     |
| a~c    | `a`, `b`, `c` |

Concatting `Weekday` code and `Period` code to represent a class period. Concatting class periods to represent the course time.

`ClassPeriod` = `Weekday` + `Period`  
`Time` = `ClassPeriod`\*

### Example

```
M3M4TaTbR5
```

## `Course` _Object_

| name             | type           | description                                                  |
| ---------------- | -------------- | ------------------------------------------------------------ |
| `number`         | CourseNumber   | Course number                                                |
| `title`          | String         | _Optional_ Course title                                      |
| `credit`         | Number         | _Optional_ Course credit                                     |
| `time`           | Time           | _Optional_ Course time                                       |
| `room`           | String         | _Optional_ Classroom                                         |
| `required`       | String         | _Optional_ Whether ths course is required                    |
| `size_limit`     | Number         | _Optional_ Classroom size limit                              |
| `previous_size`  | Number         | _Optional_ Number of enrolled student in the previous period |
| `prerequirement` | String         | _Optional_ Course prerequirement                             |
| `memo`           | String         | _Optional_ Course memo                                       |
| `random`         | Number         | _Optional_ _For course selecting_                            |
| `canceled`       | Boolean        | _Optional_ Whether the course is canceled                    |
| `sc_code`        | DepartmentAbbr | _Optional_ _For course selecting_                            |
| `sc_div`         | String         | _Optional_ _For course selecting_                            |
| `sc_real`        | String         | _Optional_ _For course selecting_                            |
| `sc_ctime`       | String         | _Optional_ _For course selecting_                            |
| `sc_glimit`      | String         | _Optional_ _For course selecting_                            |
| `sc_type`        | String         | _Optional_ _For course selecting_                            |
| `sc_pre`         | String         | _Optional_ _For course selecting_                            |
| `sc_range`       | String         | _Optional_ _For course selecting_                            |

## `CourseStatus` _Object_

| name           | type         | description                                                           |
| -------------- | ------------ | --------------------------------------------------------------------- |
| `number`       | CourseNumber |                                                                       |
| `status`       | Number       | `0`: 未選上, `1`: 已選上, `2`: 亂數中                                 |
| `orderCatalog` | String       | `''`, `通`, `中`, or `體`.                                            |
| `order`        | Number       | `0`: not waiting for random process, `1~20`: order for random process |

## `CurrentSelectedCourses` _CourseStatus[]_

## `Department` _Object_

| name        | type           | description                |
| ----------- | -------------- | -------------------------- |
| abbr        | DepartmentAbbr | Abbreviation of department |
| chineseName | String         | Chinses name of department |
| englishName | String         | English name of department |
| classes     | Classes[]      | English name of department |

### Example

```json
{
  "abbr": "ANTH",
  "chineseName": "人類所",
  "englishName": "Anthropology",
  "classes": [
    {
      "abbr": "ANTH106D",
      "level": "106D",
      "name": "人類所博士班",
      "chineseName": "人類所博士班",
      "englishName": "I don't know"
    }
  ]
}
```

## `Classes` _Object_

| name        | type      | description                                             |
| ----------- | --------- | ------------------------------------------------------- |
| abbr        | ClassAbbr | Abbreviation of class                                   |
| level       | Level     | Level of class                                          |
| name        | String    | Chinses name of class, and alternative of `chineseName` |
| chineseName | String    | Chinses name of class                                   |
| englishName | String    | English name of class                                   |

### Example

```json
{
  "abbr": "ANTH106D",
  "level": "106D",
  "name": "人類所博士班",
  "chineseName": "人類所博士班",
  "englishName": "I don't know"
}
```

## `Syllabus` _Object_

| name               | type         | description                                                                                                                                                                     |
| ------------------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `number`           | CourseNumber |                                                                                                                                                                                 |
| `chineseTitle`     | String       |                                                                                                                                                                                 |
| `englishTitle`     | String       |                                                                                                                                                                                 |
| `credit`           | Number       |                                                                                                                                                                                 |
| `time`             | Time         |                                                                                                                                                                                 |
| `room`             | String       |                                                                                                                                                                                 |
| `professor`        | String       |                                                                                                                                                                                 |
| `size_limit`       | Number       |                                                                                                                                                                                 |
| `briefDescription` | String       |                                                                                                                                                                                 |
| `description`      | String       |                                                                                                                                                                                 |
| `file`             | Boolean      | If `file` is true, the description is provided in a file. The file could be downloaded at `https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/JH/output/6_6.1_6.1.12/{courseNumber}.pdf` |

## `AvailableSelectionResult` _Map<Semester, Phase>_

`AvailableSelectionResult` is an object that mapped with `Semester` (such as `10610` for first semester of 民國 106 年) and list of all of the currently available selection period result.

### Example

```json
{
  "10610": ["100", "100P"]
}
```

---

# Courses Database Architecture

在`courses_db.json`中包含三個主要部分，

* `departments`: 所有科系，及其包含的各班(如大學部、碩士班、博士班)
* `catalog`: 所有科系的總錄及各班該年級的必選修
* `courses`: 所有課程的資訊

| name        | type                                             | description                                                                                                                                                                 |
| ----------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| departments | Map<DepartmentAbbr, Department>                  | 所有科系，及其包含的各班(如大學部、碩士班、博士班)                                                                                                                          |
| catalog     | Map<DepartmentAbbr \| ClassAbbr, CourseNumber[]> | 所有科系的總錄及各班該年級的必選修                                                                                                                                          |
| courses     | Map<CourseNumber, Course>                        | 所有課程的資訊，其中`Course`請填滿全部屬性                                                                                                                                  |
| time        | TimeStampInMS                                    | The last update time, the return value is the same as [Date.now() in JavaScript](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Date/now) |

The `time` value is used to check the version of the `courses_db.json`.

## Example

```json
{
  "departments": {
    "ANTH": {
      "abbr": "ANTH",
      "chineseName": "人類所",
      "englishName": "Anthropology",
      "classes": [
        {
          "abbr": "ANTH106D",
          "level": "106D",
          "name": "人類所博士班",
          "chineseName": "人類所博士班",
          "englishName": "I don't know"
        }
        // and more
      ]
    }
    // and more
  },
  "catalog": {
    "CHE 103B": ["10620CHE 410000", "10620CHE 431200"],
    "CHEM": [
      "10620CHEM102001",
      "10620CHEM102002",
      "10620CHEM102003"
      // and more
    ]
    // and more
  },
  "courses": {
    "10620KPEN510600": {
      "number": "10620KPEN510600",
      "title": "統計軟體應用",
      "credit": "2",
      "time": "W9Wa"
      // and more
    }
  }
}
```

---

# Errors

## Package

| name    | type   | description |
| ------- | ------ | ----------- |
| `error` | Number |             |
| `id`    | Number |             |
| `msg`   | String |             |
| `more`  | Any    | _Optional_  |

### Example

```
{
  error: 1,
  id: 38,
  msg: 'The course number is not valid.'
}
```
