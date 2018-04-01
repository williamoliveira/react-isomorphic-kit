

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = void 0

const _path = require('path')

const _appRootDir = _interopRequireDefault(require('app-root-dir'))

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

const _default = relative =>
  require((0, _path.resolve)(_appRootDir.default.get(), relative))

exports.default = _default

if (process.env.BUILD_FLAG_IS_CLIENT === 'true') {
  throw new Error("This file shouldn't be imported on client side code")
}
