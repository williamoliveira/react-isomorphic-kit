

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = void 0

const _express = _interopRequireDefault(require('express'))

const _webpackDevMiddleware = _interopRequireDefault(require('webpack-dev-middleware'))

const _webpackHotMiddleware = _interopRequireDefault(require('webpack-hot-middleware'))

const _listenerManager = _interopRequireDefault(require('./listenerManager'))

const _utils = require('../utils')

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

class HotClientServer {
  constructor(port, compiler) {
    const app = (0, _express.default)()
    const httpPathRegex = /^https?:\/\/(.*):([\d]{1,5})/i
    const httpPath = compiler.options.output.publicPath

    if (!httpPath.startsWith('http') && !httpPathRegex.test(httpPath)) {
      throw new Error(
        'You must supply an absolute public path to a development build of a web target bundle as it will be hosted on a seperate development server to any node target bundles.',
      )
    }

    this.webpackDevMiddleware = (0, _webpackDevMiddleware.default)(compiler, {
      quiet: true,
      noInfo: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      publicPath: compiler.options.output.publicPath,
    })
    app.use(this.webpackDevMiddleware)
    app.use((0, _webpackHotMiddleware.default)(compiler))
    const listener = app.listen(port)
    this.listenerManager = new _listenerManager.default(listener, 'client')
    compiler.plugin('compile', () => {
      (0, _utils.log)({
        title: 'client',
        level: 'info',
        message: 'Building new bundle...',
      })
    })
    compiler.plugin('done', (stats) => {
      if (stats.hasErrors()) {
        (0, _utils.log)({
          title: 'client',
          level: 'error',
          message: 'Build failed, please check the console for more information.',
          notify: true,
        })
        console.error(stats.toString())
      } else {
        (0, _utils.log)({
          title: 'client',
          level: 'info',
          message: 'Running with latest changes.',
          notify: true,
        })
      }
    })
  }

  dispose() {
    this.webpackDevMiddleware.close()
    return this.listenerManager ? this.listenerManager.dispose() : Promise.resolve()
  }
}

const _default = HotClientServer
exports.default = _default
