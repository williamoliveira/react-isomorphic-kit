

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = void 0

const _path = _interopRequireDefault(require('path'))

const _appRootDir = _interopRequireDefault(require('app-root-dir'))

const _child_process = require('child_process')

const _utils = require('../utils')

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

class HotNodeServer {
  constructor(port, name, compiler, clientCompiler) {
    const compiledEntryFile = _path.default.resolve(
      _appRootDir.default.get(),
      compiler.options.output.path,
      `${Object.keys(compiler.options.entry)[0]}.js`,
    )

    const startServer = () => {
      if (this.server) {
        this.server.kill()
        this.server = null;
        (0, _utils.log)({
          title: name,
          level: 'info',
          message: 'Restarting server...',
        })
      }

      const env = Object.assign(process.env, {
        PORT: port,
      })
      const newServer = (0, _child_process.spawn)('node', [
        compiledEntryFile,
        '--color',
        {
          env,
        },
      ]);
      (0, _utils.log)({
        title: name,
        level: 'info',
        message: 'Server running with latest changes.',
        notify: true,
      })
      newServer.stdout.on('data', data => console.log(data.toString().trim()))
      newServer.stderr.on('data', (data) => {
        (0, _utils.log)({
          title: name,
          level: 'error',
          message: 'Error in server execution, check the console for more info.',
        })
        console.error(data.toString().trim())
      })
      this.server = newServer
    }

    const waitForClientThenStartServer = () => {
      if (this.serverCompiling) {
        return
      }

      if (this.clientCompiling) {
        setTimeout(waitForClientThenStartServer, 50)
      } else {
        startServer()
      }
    }

    clientCompiler.plugin('compile', () => {
      this.clientCompiling = true
    })
    clientCompiler.plugin('done', (stats) => {
      if (!stats.hasErrors()) {
        this.clientCompiling = false
      }
    })
    compiler.plugin('compile', () => {
      this.serverCompiling = true;
      (0, _utils.log)({
        title: name,
        level: 'info',
        message: 'Building new bundle...',
      })
    })
    compiler.plugin('done', (stats) => {
      this.serverCompiling = false
      console.log('2. Done compiling')

      if (this.disposing) {
        return
      }

      try {
        if (stats.hasErrors()) {
          (0, _utils.log)({
            title: name,
            level: 'error',
            message: 'Build failed, check the console for more information.',
            notify: true,
          })
          console.log(stats.toString())
          return
        }

        waitForClientThenStartServer()
      } catch (err) {
        (0, _utils.log)({
          title: name,
          level: 'error',
          message: 'Failed to start, please check the console for more information.',
          notify: true,
        })
        console.error(err)
      }
    })
    this.watcher = compiler.watch(null, () => undefined)
  }

  dispose() {
    this.disposing = true
    const stopWatcher = new Promise((resolve) => {
      this.watcher.close(resolve)
    })
    return stopWatcher.then(() => {
      if (this.server) this.server.kill()
    })
  }
}

const _default = HotNodeServer
exports.default = _default
