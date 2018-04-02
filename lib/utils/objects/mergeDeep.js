

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = mergeDeep

const _clean = _interopRequireDefault(require('../arrays/clean'))

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

function mergeDeep(...args) {
  const filtered = (0, _clean.default)(args)

  if (filtered.length < 1) {
    return {}
  }

  if (filtered.length === 1) {
    return args[0]
  }

  return filtered.reduce((acc, cur) => {
    Object.keys(cur).forEach((key) => {
      if (typeof acc[key] === 'object' && typeof cur[key] === 'object') {
        // eslint-disable-next-line no-param-reassign
        acc[key] = mergeDeep(acc[key], cur[key])
      } else {
        // eslint-disable-next-line no-param-reassign
        acc[key] = cur[key]
      }
    })
    return acc
  }, {})
}
