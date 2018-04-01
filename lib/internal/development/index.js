

const _http = _interopRequireDefault(require('http'))

const _openBrowser = _interopRequireDefault(require('react-dev-utils/openBrowser'))

const _WebpackDevServerUtils = require('react-dev-utils/WebpackDevServerUtils')

const _detectPortAlt = _interopRequireDefault(require('detect-port-alt'))

const _chokidar = _interopRequireDefault(require('chokidar'))

const _path = require('path')

const _appRootDir = _interopRequireDefault(require('app-root-dir'))

const _config = _interopRequireDefault(require('../../config'))

const _utils = require('../utils')

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

const host = (0, _config.default)('host')

const onResponsive = (hostname, port, cb) =>
  setTimeout(
    () =>
      _http.default
        .get(
          {
            hostname,
            port,
            path: '/',
            agent: false,
          },
          cb,
        )
        .on('error', () => onResponsive(hostname, port, cb)),
    1000,
  ) // Prompt the user to select port if it's already taken.
// Resolves with newly selected port or null if cancelled.

;(0, _WebpackDevServerUtils.choosePort)(host, (0, _config.default)('port'))
  .then(port =>
    (0, _detectPortAlt.default)((0, _config.default)('clientDevServerPort')).then(
      clientPort => [port, clientPort],
    ),
  )
  .then(([port, clientPort]) => {
    if (!port || !clientPort) {
      console.error('User cancelled')
      return
    }

    let HotDevelopment = require('./hotDevelopment').default

    let devServer = new HotDevelopment(port, clientPort) // Any changes to our webpack bundleConfigs should restart the development devServer.

    const watcher = _chokidar.default.watch([
      (0, _path.resolve)(_appRootDir.default.get(), 'internal'),
      (0, _path.resolve)(_appRootDir.default.get(), 'config'),
    ])

    watcher.on('ready', () => {
      watcher.on('change', () => {
        (0, _utils.log)({
          title: 'webpack',
          level: 'warn',
          message:
            'Project build configuration has changed. Restarting the development devServer...',
        })
        devServer.dispose().then(() => {
          // Make sure our new webpack bundleConfigs aren't in the module cache.
          Object.keys(require.cache).forEach((modulePath) => {
            if (modulePath.indexOf('config') !== -1) {
              delete require.cache[modulePath]
            } else if (modulePath.indexOf('internal') !== -1) {
              delete require.cache[modulePath]
            }
          }) // Re-require the development devServer so that all new configs are used.

          HotDevelopment = require('./hotDevelopment').default // Create a new development devServer.

          devServer = new HotDevelopment(port, clientPort)
        })
      }) // Wait until devServer is started to open browser

      onResponsive(host, port, () => (0, _openBrowser.default)(`http://${host}:${port}`))
    }) // If we receive a kill cmd then we will first try to dispose our listeners.

    process.on(
      'SIGTERM',
      () => devServer && devServer.dispose().then(() => process.exit(0)),
    )
  })
