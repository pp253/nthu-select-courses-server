module.exports = {
  root: true,
  env: {
    node: true
  },
  rules: {
    singleQuote: true,
    semi: 0,
    trailingComma: 'none'
  },
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 6,
    sourceType: 'module'
  }
}
