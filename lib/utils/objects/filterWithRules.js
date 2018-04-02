

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = filterWithRules

function filterWithRulesLoop(rules, obj, basePropPath = '') {
  return Object.keys(rules).reduce((acc, key) => {
    const propPath = basePropPath !== '' ? `${basePropPath}.${key}` : key

    if (typeof rules[key] === 'object') {
      if (typeof obj[key] !== 'object') {
        throw new Error(`Expected prop at path "${propPath}" to be an object`)
      }

      acc[key] = filterWithRulesLoop(rules[key], obj[key], propPath) // eslint-disable-line no-param-reassign,max-len
    } else if (rules[key]) {
      if (typeof obj[key] === 'undefined') {
        throw new Error(
          `Filter set an "allow" on path "${propPath}", however, this path was not found on the source object.`,
        )
      }

      acc[key] = obj[key] // eslint-disable-line no-param-reassign
    }

    return acc
  }, {})
}

function filterWithRules(rules, obj) {
  return filterWithRulesLoop(rules, obj)
}
