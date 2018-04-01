

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.log = log
exports.exec = exec

const _nodeNotifier = _interopRequireDefault(require('node-notifier'))

const _chalk = _interopRequireDefault(require('chalk'))

const _child_process = require('child_process')

const _appRootDir = _interopRequireDefault(require('app-root-dir'))

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

function log(options) {
  const title = `${options.title.toUpperCase()}`

  if (options.notify) {
    _nodeNotifier.default.notify({
      title,
      message: options.message,
    })
  }

  const level = options.level || 'info'
  const msg = `${title}: ${options.message}`

  switch (level) {
    case 'warn':
      console.log(_chalk.default.yellow(msg))
      break

    case 'error':
      console.log(_chalk.default.bgRed.white.bold(msg))
      break

    case 'special':
      console.log(_chalk.default.italic.cyanBright(msg))
      break

    case 'info':
    default:
      console.log(_chalk.default.green(msg))
  }
}

function exec(command) {
  (0, _child_process.execSync)(command, {
    stdio: 'inherit',
    cwd: _appRootDir.default.get(),
  })
}
