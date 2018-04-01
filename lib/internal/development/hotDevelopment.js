

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = void 0

const _path = require('path')

const _webpack = _interopRequireDefault(require('webpack'))

const _appRootDir = _interopRequireDefault(require('app-root-dir'))

const _utils = require('../utils')

const _hotNodeServer = _interopRequireDefault(require('./hotNodeServer'))

const _hotClientServer = _interopRequireDefault(require('./hotClientServer'))

const _createVendorDLL = _interopRequireDefault(require('./createVendorDLL'))

const _configFactory = _interopRequireDefault(require('../webpack/configFactory'))

const _config = _interopRequireWildcard(require('../../config'))

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj
  }
  const newObj = {}
  if (obj != null) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const desc =
            Object.defineProperty && Object.getOwnPropertyDescriptor
              ? Object.getOwnPropertyDescriptor(obj, key)
              : {}
        if (desc.get || desc.set) {
          Object.defineProperty(newObj, key, desc)
        } else {
          newObj[key] = obj[key]
        }
      }
    }
  }
  newObj.default = obj
  return newObj
}

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

const usesDevVendorDLL = bundleConfig =>
  bundleConfig.devVendorDLL != null && bundleConfig.devVendorDLL.enabled

const vendorDLLsFailed = (err) => {
  (0, _utils.log)({
    title: 'vendorDLL',
    level: 'error',
    message:
      'Unfortunately an error occured whilst trying to build the vendor dll(s) used by the development server. Please check the console for more information.',
    notify: true,
  })

  if (err) {
    console.error(err)
  }
}

const initializeBundle = (name, bundleConfig) => {
  const createCompiler = () => {
    try {
      const webpackConfig = (0, _configFactory.default)({
        target: name,
        mode: 'development',
      })

      if (name === 'client' && usesDevVendorDLL(bundleConfig)) {
        webpackConfig.plugins.push(
          new _webpack.default.DllReferencePlugin({
            manifest: require((0, _path.resolve)(
              _appRootDir.default.get(),
              bundleConfig.outputPath,
              `${bundleConfig.devVendorDLL.name}.json`,
            )),
          }),
        )
      }

      return (0, _webpack.default)(webpackConfig)
    } catch (err) {
      (0, _utils.log)({
        title: 'development',
        level: 'error',
        message:
          'Webpack config is invalid, please check the console for more information.',
        notify: true,
      })
      console.error(err)
      throw err
    }
  }

  return {
    name,
    bundleConfig,
    createCompiler,
  }
}

class HotDevelopment {
  constructor(port, clientPort) {
    this.hotClientServer = null
    this.hotNodeServers = [];
    (0, _config.set)('clientDevServerPort', clientPort)
    process.env.PORT = port
    process.env.CLIENT_DEV_PORT = clientPort
    const clientBundle = initializeBundle(
      'client',
      (0, _config.default)('bundles.client'),
    )
    const nodeBundles = [
      initializeBundle('server', (0, _config.default)('bundles.server')),
    ]
    Promise.resolve(
      usesDevVendorDLL((0, _config.default)('bundles.client'))
        ? (0, _createVendorDLL.default)('client', (0, _config.default)('bundles.client'))
        : true,
    )
      .then(
        () =>
          new Promise((resolve) => {
            const { createCompiler } = clientBundle
            const compiler = createCompiler()
            compiler.plugin('done', (stats) => {
              if (!stats.hasErrors()) {
                resolve(compiler)
              }
            })
            this.hotClientServer = new _hotClientServer.default(clientPort, compiler)
          }),
        vendorDLLsFailed,
      )
      .then((clientCompiler) => {
        this.hotNodeServers = nodeBundles.map(
          ({ name, createCompiler }) =>
            new _hotNodeServer.default(port, name, createCompiler(), clientCompiler),
        )
      })
  }

  dispose() {
    const safeDisposer = server => (server ? server.dispose() : Promise.resolve())

    return safeDisposer(this.hotClientServer).then(() =>
      Promise.all(this.hotNodeServers.map(safeDisposer)),
    )
  }
}

const _default = HotDevelopment
exports.default = _default
