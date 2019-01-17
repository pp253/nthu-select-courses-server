export default function grabHelper(node, level = 0, initIndex = 0) {
  if (!node) {
    return
  }

  if (node.toArray) {
    grabHelper(node.toArray())
  } else {
    if (node instanceof Array) {
      let idx = initIndex
      for (let childNode of node) {
        grabHelper(childNode, level, idx++)
      }
    } else {
      if (node.type === 'text') {
        console.log(
          ' '.repeat(level * 2) +
            '\x1b[34m' +
            initIndex +
            '\x1b[0m "' +
            node.data.replace(/\n/g, '\\n') +
            '"'
        )
      } else {
        console.log(
          ' '.repeat(level * 2) +
            '\x1b[34m' +
            initIndex +
            ' \x1b[32m<' +
            node.name +
            '>\x1b[0m'
        )
        grabHelper(node.children, level + 1)
      }
    }
  }
}
