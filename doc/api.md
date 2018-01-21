# API

## User (`/api/user/`)

## Select Course (`/api/select_course/`)

### `getCoursesList`

Get courses list.

#### Parameters

None.

#### Return Value

- `data`
  - `departments`: *Object* 記錄各系所，並在其classes中記錄各班. Mapping with course number and `Department`.
    - `Department`: *Object*
      - `classes` *Array*
  - `catalog`: *Object* 紀錄各系、各班所開設課程，僅用`number`(即課程代碼 course number)連結課程
  - `courses`: *Object* 紀錄所有課程

### `getCurrentSelectedCourses`

Get current selected courses of an user.

#### Parameters

- `sessionToken`: *String* **Required**

#### Return Value

- `currentSelectedCourses`: *Array*
  - `Course`: *Object*
    - `number`: *String* Course number
    - `status`: *String* Selecting status. `1` for success; `2` for waiting for random process; `3` for failed.
    - `order`: *Number* Order for random process.
    - `orderCatalog`: *String* Order's catalog, such as '通' or '體'.


### `addCourse`

加入課程是`type:1`

```
{
    ACIXSTORE: sessionToken,
    toChk: '',
    new_dept: 'IEEM',
    new_class: 'IEEM105B',
    aspr: '',
    ckey: courseNumber,
    code: 'IEEM',
    div: 'ENGI',
    real: 'WW0437',
    cred: '3',
    ctime: 'T3T4R4<br>',
    num: '80',
    glimit: '',
    type: '',
    pre: '',
    range: '+',
    chkbtn: 'add'
  }

```
