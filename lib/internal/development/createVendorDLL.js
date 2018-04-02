

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = void 0

const _webpack = _interopRequireDefault(require('webpack'))

const _path = require('path')

const _appRootDir = _interopRequireDefault(require('app-root-dir'))

const _md = _interopRequireDefault(require('md5'))

const _fs = _interopRequireDefault(require('fs'))

const _config = _interopRequireDefault(require('../config'))

const _utils = require('../utils')

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

function createVendorDLL(bundleName, bundleConfig) {
  const dllConfig = (0, _config.default)('bundles.client.devVendorDLL')

  const pkg = require((0, _path.resolve)(_appRootDir.default.get(), './package.json'))

  const devDLLDependencies = dllConfig.include.sort()
  const currentDependenciesHash = (0, _md.default)(
    JSON.stringify(
      devDLLDependencies.map(dep => [
        dep,
        pkg.dependencies[dep],
        pkg.devDependencies[dep],
      ]),
    ),
  )
  const vendorDLLHashFilePath = (0, _path.resolve)(
    _appRootDir.default.get(),
    bundleConfig.outputPath,
    `${dllConfig.name}_hash`,
  )

  function webpackConfigFactory() {
    return {
      mode: 'development',
      devtool: 'inline-source-map',
      entry: {
        [dllConfig.name]: devDLLDependencies,
      },
      output: {
        path: (0, _path.resolve)(_appRootDir.default.get(), bundleConfig.outputPath),
        filename: `${dllConfig.name}.js`,
        library: dllConfig.name,
      },
      plugins: [
        new _webpack.default.DllPlugin({
          path: (0, _path.resolve)(
            _appRootDir.default.get(),
            bundleConfig.outputPath,
            `./${dllConfig.name}.json`,
          ),
          name: dllConfig.name,
        }),
      ],
    }
  }

  function buildVendorDLL() {
    return new Promise((resolve, reject) => {
      const webpackConfig = webpackConfigFactory()
      const vendorDLLCompiler = (0, _webpack.default)(webpackConfig)
      vendorDLLCompiler.run((err) => {
        if (err) {
          reject(err)
          return
        }

        try {
          _fs.default.writeFileSync(vendorDLLHashFilePath, currentDependenciesHash)
        } catch (err2) {
          reject(err2)
          return
        }

        (0, _utils.log)({
          title: 'vendorDLL',
          level: 'info',
          message: `Vendor DLL build complete. The following dependencies have been included:\n\t-${devDLLDependencies.join(
            '\n\t-',
          )}\n`,
        })
        resolve()
      })
    })
  }

  return new Promise((resolve, reject) => {
    if (!_fs.default.existsSync(vendorDLLHashFilePath)) {
      (0, _utils.log)({
        title: 'vendorDLL',
        level: 'warn',
        message: `Generating a new "${bundleName}" Vendor DLL for boosted development performance.
The Vendor DLL helps to speed up your development workflow by reducing Webpack build times.  It does this by seperating Vendor DLLs from your primary bundles, thereby allowing Webpack to ignore them when having to rebuild your code for changes.  We recommend that you add all your client bundle specific dependencies to the Vendor DLL configuration (within /config).`,
      })
      buildVendorDLL()
        .then(resolve)
        .catch(reject)
    } else {
      const dependenciesHash = _fs.default.readFileSync(vendorDLLHashFilePath, 'utf8')

      const dependenciesChanged = dependenciesHash !== currentDependenciesHash

      if (dependenciesChanged) {
        (0, _utils.log)({
          title: 'vendorDLL',
          level: 'warn',
          message: `New "${bundleName}" vendor dependencies detected. Regenerating the vendor dll...`,
        })
        buildVendorDLL()
          .then(resolve)
          .catch(reject)
      } else {
        (0, _utils.log)({
          title: 'vendorDLL',
          level: 'info',
          message: `No changes to existing "${bundleName}" vendor dependencies. Using the existing vendor dll.`,
        })
        resolve()
      }
    }
  })
}

const _default = createVendorDLL
exports.default = _default
