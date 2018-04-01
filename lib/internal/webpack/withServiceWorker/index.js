

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = withServiceWorker

const _glob = require('glob')

const _appRootDir = _interopRequireDefault(require('app-root-dir'))

const _path = _interopRequireDefault(require('path'))

const _htmlWebpackPlugin = _interopRequireDefault(require('html-webpack-plugin'))

const _offlinePlugin = _interopRequireDefault(require('offline-plugin'))

const _config = _interopRequireDefault(require('../../../config'))

const _ClientConfig = _interopRequireDefault(require('../../../components/ClientConfig'))

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

function withServiceWorker(webpackConfig, bundleConfig) {
  if (!(0, _config.default)('serviceWorker.enabled')) {
    return webpackConfig
  }

  webpackConfig.plugins.push(
    new _htmlWebpackPlugin.default({
      filename: (0, _config.default)('serviceWorker.offlinePageFileName'),
      template: `babel-loader!${_path.default.resolve(
        __dirname,
        './offlinePageTemplate.js',
      )}`,
      production: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeNilAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      inject: true,
      custom: {
        config: _config.default,
        ClientConfig: _ClientConfig.default,
      },
    }),
  )
  webpackConfig.plugins.push(
    new _offlinePlugin.default({
      publicPath: bundleConfig.webPath,
      relativePaths: false,
      ServiceWorker: {
        output: (0, _config.default)('serviceWorker.fileName'),
        events: true,
        publicPath: `/${(0, _config.default)('serviceWorker.fileName')}`,
        navigateFallbackURL: `${bundleConfig.webPath}${(0, _config.default)(
          'serviceWorker.offlinePageFileName',
        )}`,
      },
      AppCache: false,
      externals: ((0, _config.default)('polyfillIO.enabled')
        ? [
          `${(0, _config.default)('polyfillIO.url')}?features=${(0, _config.default)(
            'polyfillIO.features',
          ).join(',')}`,
        ]
        : []
      ).concat(
        (0, _config.default)('serviceWorker.includePublicAssets').reduce((acc, cur) => {
          const publicAssetPathGlob = _path.default.resolve(
            _appRootDir.default.get(),
            (0, _config.default)('publicAssetsPath'),
            cur,
          )

          const publicFileWebPaths = acc.concat(
            (0, _glob.sync)(publicAssetPathGlob, {
              nodir: true,
            })
              .map(publicFile =>
                _path.default.relative(
                  _path.default.resolve(
                    _appRootDir.default.get(),
                    (0, _config.default)('publicAssetsPath'),
                  ),
                  publicFile,
                ),
              )
              .map(relativePath => `/${relativePath}`),
          )
          return publicFileWebPaths
        }, []),
      ),
    }),
  )
  return webpackConfig
}
