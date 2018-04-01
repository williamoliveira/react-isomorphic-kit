

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = _default

const _get = _interopRequireDefault(require('lodash/get'))

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

let configCache

function resolveConfigForBrowserOrNode() {
  if (configCache) return configCache

  if (
    typeof process.env.BUILD_FLAG_IS_NODE === 'undefined' ||
    process.env.BUILD_FLAG_IS_NODE === 'true'
  ) {
    configCache = require('./values').default
    return configCache
  }

  if (typeof window !== 'undefined' && typeof window.__CLIENT_CONFIG__ === 'object') {
    configCache = window.__CLIENT_CONFIG__
  } else {
    console.warn('No client configuration object was bound to the window.')
    configCache = {}
  }

  return configCache
}

function _default(path) {
  const config = resolveConfigForBrowserOrNode()
  return (0, _get.default)(config, path)
}
