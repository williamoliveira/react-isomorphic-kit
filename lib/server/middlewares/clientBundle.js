

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = void 0

const _express = _interopRequireDefault(require('express'))

const _path = require('path')

const _appRootDir = _interopRequireDefault(require('app-root-dir'))

const _config = _interopRequireDefault(require('../../../config'))

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

const _default = _express.default.static(
  (0, _path.resolve)(
    _appRootDir.default.get(),
    (0, _config.default)('bundles.client.outputPath'),
  ),
  {
    maxAge: (0, _config.default)('browserCacheMaxAge'),
  },
)

exports.default = _default
