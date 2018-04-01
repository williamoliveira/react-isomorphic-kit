

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = _default

const _appRootDir = _interopRequireDefault(require('app-root-dir'))

const _assetsWebpackPlugin = _interopRequireDefault(require('assets-webpack-plugin'))

const _extractTextWebpackPlugin = _interopRequireDefault(
  require('extract-text-webpack-plugin'),
)

const _uglifyjsWebpackPlugin = _interopRequireDefault(require('uglifyjs-webpack-plugin'))

const _webpackNodeExternals = _interopRequireDefault(require('webpack-node-externals'))

const _hardSourceWebpackPlugin = _interopRequireDefault(
  require('hard-source-webpack-plugin'),
)

const _path = _interopRequireDefault(require('path'))

const _webpack = _interopRequireDefault(require('webpack'))

const _utils = require('../utils')

const _logic = require('../utils/logic')

const _objects = require('../utils/objects')

const _arrays = require('../utils/arrays')

const _withServiceWorker = _interopRequireDefault(require('./withServiceWorker'))

const _config = _interopRequireDefault(require('../../config'))

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

function _default(buildOptions) {
  const { target, optimize = false } = buildOptions
  const isProd = optimize
  const isDev = !isProd
  const isClient = target === 'client'
  const isServer = target === 'server'
  const isNode = !isClient
  const ifDev = (0, _logic.ifElse)(isDev)
  const ifProd = (0, _logic.ifElse)(isProd)
  const ifNode = (0, _logic.ifElse)(isNode)
  const ifClient = (0, _logic.ifElse)(isClient)
  const ifDevClient = (0, _logic.ifElse)(isDev && isClient)
  const ifProdClient = (0, _logic.ifElse)(isProd && isClient);
  (0, _utils.log)({
    level: 'info',
    title: 'Webpack',
    message: `Creating ${
      isProd ? 'an optimised' : 'a development'
    } bundle configuration for the "${target}"`,
  })
  const bundleConfig =
    isServer || isClient
      ? (0, _config.default)(['bundles', target])
      : (0, _config.default)(['additionalNodeBundles', target])

  if (!bundleConfig) {
    throw new Error('No bundle configuration exists for target:', target)
  }

  const localIdentName = ifDev('[name]_[local]_[hash:base64:5]', '[hash:base64:10]')
  let webpackConfig = {
    mode: ifDev('development', 'production'),
    entry: {
      index: (0, _arrays.clean)([
        ifClient('regenerator-runtime/runtime'),
        ifDevClient('react-hot-loader/patch'),
        ifDevClient(
          () =>
            `webpack-hot-middleware/client?reload=true&path=http://${(0, _config.default)(
              'host',
            )}:${(0, _config.default)('clientDevServerPort')}/__webpack_hmr`,
        ),
        _path.default.resolve(_appRootDir.default.get(), bundleConfig.srcEntryFile),
      ]),
    },
    output: {
      path: _path.default.resolve(_appRootDir.default.get(), bundleConfig.outputPath),
      filename: ifProdClient('[name]-[chunkhash].js', '[name].js'),
      chunkFilename: '[name]-[chunkhash].js',
      libraryTarget: ifNode('commonjs2', 'var'),
      publicPath: ifDev(
        `http://${(0, _config.default)('host')}:${(0, _config.default)(
          'clientDevServerPort',
        )}${(0, _config.default)('bundles.client.webPath')}`,
        bundleConfig.webPath,
      ),
      hotUpdateChunkFilename: '[hash].hot-update.js',
    },
    target: isClient ? 'web' : 'node',
    node: {
      __dirname: true,
      __filename: true,
    },
    devtool: (0, _logic.ifElse)(
      isNode ||
        isDev ||
        (0, _config.default)('includeSourceMapsForOptimisedClientBundle'),
    )('cheap-module-source-map', 'hidden-source-map'),
    performance: ifProdClient(
      {
        hints: 'warning',
      },
      false,
    ),
    optimization: {
      minimizer: ifProdClient([
        new _uglifyjsWebpackPlugin.default({
          uglifyOptions: {
            ecma: 8,
            compress: {
              warnings: false,
              comparisons: false,
            },
            mangle: {
              safari10: true,
            },
            output: {
              comments: false,
              ascii_only: true,
            },
          },
          parallel: true,
          cache: true,
          sourceMap: (0, _config.default)('includeSourceMapsForOptimisedClientBundle'),
        }),
      ]),
    },
    resolve: {
      extensions: (0, _config.default)('bundleSrcTypes').map(ext => `.${ext}`),
      alias: {
        modernizr$: _path.default.resolve(_appRootDir.default.get(), './.modernizrrc'),
      },
    },
    externals: (0, _arrays.clean)([
      ifNode(() =>
        (0, _webpackNodeExternals.default)({
          whitelist: (0, _arrays.clean)(['source-map-support/register']).concat(
            (0, _config.default)('nodeExternalsFileTypeWhitelist') || [],
          ),
        }),
      ),
    ]),
    plugins: (0, _arrays.clean)([
      ifNode(
        () =>
          new _webpack.default.BannerPlugin({
            banner: 'require("source-map-support").install();',
            raw: true,
            entryOnly: false,
          }),
      ),
      new _webpack.default.EnvironmentPlugin({
        NODE_ENV: isProd ? 'production' : 'development',
        BUILD_FLAG_IS_CLIENT: JSON.stringify(isClient),
        BUILD_FLAG_IS_SERVER: JSON.stringify(isServer),
        BUILD_FLAG_IS_NODE: JSON.stringify(isNode),
        BUILD_FLAG_IS_DEV: JSON.stringify(isDev),
      }),
      ifClient(
        () =>
          new _assetsWebpackPlugin.default({
            filename: (0, _config.default)('bundleAssetsFileName'),
            path: _path.default.resolve(
              _appRootDir.default.get(),
              bundleConfig.outputPath,
            ),
          }),
      ),
      ifDev(() => new _webpack.default.NoEmitOnErrorsPlugin()),
      ifDev(() => new _hardSourceWebpackPlugin.default()),
      ifDevClient(
        () =>
          new _webpack.default.HotModuleReplacementPlugin({
            multiStep: true,
          }),
      ),
      ifClient(
        () =>
          new _extractTextWebpackPlugin.default({
            filename: '[name]-[contenthash].css',
            allChunks: false,
          }),
      ),
    ]),
    module: {
      strictExportPresence: true,
      rules: [
        {
          oneOf: (0, _arrays.clean)([
            {
              test: /\.jsx?$/,
              loader: 'babel-loader',
              options: (0, _config.default)('plugins.babelConfig')(
                {
                  babelrc: false,
                  presets: (0, _arrays.clean)([
                    'react',
                    'stage-3',
                    ifClient([
                      '@babel/preset-env',
                      {
                        es2015: {
                          modules: false,
                        },
                      },
                    ]),
                    ifNode([
                      '@babel/preset-env',
                      {
                        targets: {
                          node: true,
                        },
                      },
                    ]),
                  ]),
                  plugins: (0, _arrays.clean)([
                    ifDevClient('react-hot-loader/babel'),
                    ifDev('transform-react-jsx-self'),
                    ifDev('transform-react-jsx-source'),
                    ifProd('transform-react-inline-elements'),
                    ifProd('transform-react-constant-elements'),
                    'syntax-dynamic-import',
                  ]),
                },
                buildOptions,
              ),
              include: (0, _arrays.clean)([
                ...bundleConfig.srcPaths.map(srcPath =>
                  _path.default.resolve(_appRootDir.default.get(), srcPath),
                ),
                ifProdClient(
                  _path.default.resolve(_appRootDir.default.get(), 'src/html'),
                ),
              ]),
            },
            (0, _logic.ifElse)(isClient || isServer)(
              (0, _objects.mergeDeep)(
                {
                  test: /(\.scss|\.css)$/,
                },
                ifClient(() => ({
                  loaders: [
                    ..._extractTextWebpackPlugin.default.extract({
                      fallback: 'style-loader',
                      use: [
                        `css-loader?importLoaders=1&localIdentName=${localIdentName}`,
                        'postcss-loader',
                        'sass-loader?outputStyle=expanded',
                      ],
                    }),
                  ],
                })),
                ifNode({
                  loaders: [
                    `css-loader/locals?modules=0&sourceMap&importLoaders=1&localIdentName=${localIdentName}`,
                    'postcss-loader',
                    'sass-loader?outputStyle=expanded&sourceMap',
                  ],
                }),
              ),
            ),
            (0, _logic.ifElse)(isClient || isServer)({
              test: /node_modules.*\.css$/,
              use: ifProdClient(
                _extractTextWebpackPlugin.default.extract({
                  fallback: 'style-loader',
                  use: ['css-loader', 'postcss-loader'],
                }),
                [
                  ...ifNode(['css-loader/locals'], ['style-loader', 'css-loader']),
                  'postcss-loader',
                ],
              ),
            }),
            (0, _logic.ifElse)(isClient || isServer)(() => ({
              loader: 'file-loader',
              exclude: [/\.js$/, /\.html$/, /\.json$/],
              query: {
                publicPath: isDev
                  ? `http://${(0, _config.default)('host')}:${(0, _config.default)(
                    'clientDevServerPort',
                  )}${(0, _config.default)('bundles.client.webPath')}`
                  : (0, _config.default)('bundles.client.webPath'),
                emitFile: isClient,
              },
            })),
          ]),
        },
      ],
    },
  }

  if (isProd && isClient) {
    webpackConfig = (0, _withServiceWorker.default)(webpackConfig, bundleConfig)
  }

  return (0, _config.default)('plugins.webpackConfig')(webpackConfig, buildOptions)
}
