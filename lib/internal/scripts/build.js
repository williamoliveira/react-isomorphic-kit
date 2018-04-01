

const _webpack = _interopRequireDefault(require('webpack'))

const _appRootDir = _interopRequireDefault(require('app-root-dir'))

const _path = require('path')

const _configFactory = _interopRequireDefault(require('../webpack/configFactory'))

const _utils = require('../utils')

const _config = _interopRequireDefault(require('../../config'))

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

const [x, y, ...args] = process.argv
const optimize = args.findIndex(arg => arg === '--optimize') !== -1;
(0, _utils.exec)(
  `rimraf ${(0, _path.resolve)(
    _appRootDir.default.get(),
    (0, _config.default)('buildOutputPath'),
  )}`,
)
Object.keys((0, _config.default)('bundles')).forEach((bundleName) => {
  const compiler = (0, _webpack.default)(
    (0, _configFactory.default)({
      target: bundleName,
      optimize,
    }),
  )
  compiler.run((err, stats) => {
    if (err) {
      console.error(err.stack || err)
      if (err.details) console.error(err.details)
      process.exitCode = process.exitCode || 1
      return
    }

    if (stats.hasErrors()) {
      process.exitCode = process.exitCode || 1
    }

    console.log(
      stats.toString({
        colors: true,
      }),
    )
  })
})
