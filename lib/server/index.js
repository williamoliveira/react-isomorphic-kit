

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = void 0

const _express = _interopRequireDefault(require('express'))

const _cookieParser = _interopRequireDefault(require('cookie-parser'))

const _compression = _interopRequireDefault(require('compression'))

const _path = require('path')

const _appRootDir = _interopRequireDefault(require('app-root-dir'))

const _requireFromUserland = _interopRequireDefault(
  require('../../internal/utils/requireFromUserland'),
)

const _security = _interopRequireDefault(require('./middlewares/security'))

const _clientBundle = _interopRequireDefault(require('./middlewares/clientBundle'))

const _serviceWorker = _interopRequireDefault(require('./middlewares/serviceWorker'))

const _offlinePage = _interopRequireDefault(require('./middlewares/offlinePage'))

const _errorHandlers = _interopRequireDefault(require('./middlewares/errorHandlers'))

const _config = _interopRequireDefault(require('../../config'))

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

const reactApplication = (0, _requireFromUserland.default)('src/server')
const app = (0, _express.default)()
app.disable('x-powered-by')
app.use(..._security.default)
app.use((0, _cookieParser.default)())
app.use((0, _compression.default)())

if (
  process.env.BUILD_FLAG_IS_DEV === 'false' &&
  (0, _config.default)('serviceWorker.enabled')
) {
  app.get(`/${(0, _config.default)('serviceWorker.fileName')}`, _serviceWorker.default)
  app.get(
    `${(0, _config.default)('bundles.client.webPath')}${(0, _config.default)(
      'serviceWorker.offlinePageFileName',
    )}`,
    _offlinePage.default,
  )
}

app.use((0, _config.default)('bundles.client.webPath'), _clientBundle.default)
app.use(
  _express.default.static(
    (0, _path.resolve)(
      _appRootDir.default.get(),
      (0, _config.default)('publicAssetsPath'),
    ),
  ),
)
app.get('*', (request, response) => {
  console.log(`REQUEST: Received for "${request.url}"`)
  return reactApplication(request, response)
})
app.use(..._errorHandlers.default)
const listener = app.listen((0, _config.default)('port'), () =>
  console.log(`✓ ${(0, _config.default)('htmlPage.defaultTitle')} is ready!
Service Workers: ${(0, _config.default)('serviceWorker.enabled')}
Polyfills: ${(0, _config.default)('polyfillIO.enabled')} (${(0, _config.default)(
  'polyfillIO.features',
).join(', ')})
Server is now listening on Port ${(0, _config.default)('port')}
You can access it in the browser at http://${(0, _config.default)('host')}:${(0,
  _config.default)('port')}
Press Ctrl-C to stop.
`),
)
const _default = listener
exports.default = _default
