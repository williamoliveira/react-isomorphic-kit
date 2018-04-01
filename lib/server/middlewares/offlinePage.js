

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = offlinePageMiddleware

const _fs = require('fs')

const _path = require('path')

const _appRootDir = _interopRequireDefault(require('app-root-dir'))

const _config = _interopRequireDefault(require('../../../config'))

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

function offlinePageMiddleware(req, res, next) {
  if (typeof res.locals.nonce !== 'string') {
    throw new Error('A "nonce" value has not been attached to the response')
  }

  const nonce = res.locals.nonce;
  (0, _fs.readFile)(
    (0, _path.resolve)(
      _appRootDir.default.get(),
      (0, _config.default)('bundles.client.outputPath'),
      (0, _config.default)('serviceWorker.offlinePageFileName'),
    ),
    'utf-8',
    (err, data) => {
      if (err) {
        res.status(500).send('Error returning offline page.')
        return
      }

      const offlinePageWithNonce = data.replace('OFFLINE_PAGE_NONCE_PLACEHOLDER', nonce)
      res.send(offlinePageWithNonce)
    },
  )
}
