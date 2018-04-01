

const _path = require('path')

const _appRootDir = _interopRequireDefault(require('app-root-dir'))

const _rimraf = _interopRequireDefault(require('rimraf'))

const _config = _interopRequireDefault(require('../../config'))

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

function clean() {
  (0, _rimraf.default)(
    (0, _path.resolve)(
      _appRootDir.default.get(),
      (0, _config.default)('buildOutputPath'),
    ),
    () => {
      console.log(
        `Cleaned ${(0, _path.resolve)(
          _appRootDir.default.get(),
          (0, _config.default)('buildOutputPath'),
        )}`,
      )
    },
  )
}

clean()
