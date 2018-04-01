

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = void 0

const _path = require('path')

const _appRootDir = _interopRequireDefault(require('app-root-dir'))

const _config = _interopRequireDefault(require('../../config'))

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

function serviceWorkerMiddleware(req, res, next) {
  res.sendFile(
    (0, _path.resolve)(
      _appRootDir.default.get(),
      (0, _config.default)('bundles.client.outputPath'),
      (0, _config.default)('serviceWorker.fileName'),
    ),
  )
}

const _default = serviceWorkerMiddleware
exports.default = _default
