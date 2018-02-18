# Type Definition

## `CourseNumber` *String*

## `ShortCourseNumber` *String*

## `Semester` *String*

| Semester | Code |
| --- | --- |
| First semester | 10 |
| Second semester | 20 |
| Summer semester | 30 |

Combine the 3 digit 民國年分 (99年=099) with `semester code` to represent specific semester of the year.

### Example
```
10630
```

## `Time` *String*

| Weekday | Code |
| --- | --- |
| Monday | `M` |
| Thusday | `T` |
| Wednesday | `W` |
| Thursday | `R` |
| Friday | `F` |
| Saturday | `S` |

| Period | Code |
| --- | --- |
| 1~4 | `1` ~ `4` |
| Noon | `n` |
| 5~9 | `5` ~ `9` |
| a~c | `a`, `b`, `c` |

Concatting `Weekday` code and `Period` code to represent a class period. Concatting class periods to tell the course time.

### Example

```
M3M4TaTbR5
```

## `Course` *Object*

| name | type | description |
| --- | --- | --- |
| `number` | String | Course number |

## `CourseStatus` *Object*

| name | type | description |
| --- | --- | --- |
| `number` | String | |
| `status` | Number | `0`: 未選上, `1`: 已選上, `2`: 亂數中 |
| `orderCatalog` | String | `''`, `通`, `中`, or `體`. |
| `order` | Number | `0`: not waiting for random process, `1~20`: order for random process |

## `CurrentSelectedCourses` *CourseStatus[]*

## `Syllabus` *Object*

| name | type | description |
| --- | --- | --- |
| `number` | CourseNumber | |
| `chineseTitle` | String | |
| `englishTitle` | String | |
| `credit` | Number | |
| `time` | Time | |
| `room` | String | |
| `professor` | String | |
| `size_limit` | Number | |
| `briefDescription` | String | |
| `description` | String | |
| `file` | Boolean | If `file` is true, the description is provided in a file. The file could be downloaded at `https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/JH/output/6_6.1_6.1.12/{courseNumber}.pdf` |

# Errors

## Package

| name | type | description |
| --- | --- | --- |
| `error` | Number | |
| `id` | Number | |
| `msg` | String | |
| `more` | Any | *Optional* |

### Example

```
{
  error: 1,
  id: 38,
  msg: 'The course number is not valid.'
}
```

## Errors Handling


