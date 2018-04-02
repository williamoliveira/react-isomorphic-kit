

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.string = string
exports.number = number
exports.bool = bool

const _appRootDir = _interopRequireDefault(require('app-root-dir'))

const _dotenv = _interopRequireDefault(require('dotenv'))

const _fs = _interopRequireDefault(require('fs'))

const _path = _interopRequireDefault(require('path'))

const _ifElse = _interopRequireDefault(require('./logic/ifElse'))

const _clean = _interopRequireDefault(require('./arrays/clean'))

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

function registerEnvFile() {
  const DEPLOYMENT = process.env.DEPLOYMENT
  const envFile = '.env'
  const envFileResolutionOrder = (0, _clean.default)([
    _path.default.resolve(_appRootDir.default.get(), envFile),
    (0, _ifElse.default)(DEPLOYMENT)(
      _path.default.resolve(_appRootDir.default.get(), `${envFile}.${DEPLOYMENT}`),
    ),
  ])
  const envFilePath = envFileResolutionOrder.find(filePath =>
    _fs.default.existsSync(filePath),
  )

  if (envFilePath) {
    console.log(`==> Registering environment variables from: ${envFilePath}`)

    _dotenv.default.config({
      path: envFilePath,
    })
  }
}

registerEnvFile()

function string(name, defaultVal) {
  return process.env[name] || defaultVal
}

function number(name, defaultVal) {
  return process.env[name] ? parseInt(process.env[name], 10) : defaultVal
}

function bool(name, defaultVal) {
  return process.env[name]
    ? process.env[name] === 'true' || process.env[name] === '1'
    : defaultVal
}
