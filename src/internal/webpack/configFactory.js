import appRootDir from 'app-root-dir'
import AssetsPlugin from 'assets-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'
import nodeExternals from 'webpack-node-externals'
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin'
import path from 'path'
import webpack from 'webpack'
import { log } from '../utils'
import { ifElse } from '../../utils/logic'
import { mergeDeep } from '../../utils/objects'
import { clean } from '../../utils/arrays'
import withServiceWorker from './withServiceWorker'
import config from '../config'

export default function (buildOptions) {
  const { target, optimize = false } = buildOptions

  const isProd = optimize
  const isDev = !isProd
  const isClient = target === 'client'
  const isServer = target === 'server'
  const isNode = !isClient

  const ifDev = ifElse(isDev)
  const ifProd = ifElse(isProd)
  const ifNode = ifElse(isNode)
  const ifClient = ifElse(isClient)
  const ifDevClient = ifElse(isDev && isClient)
  const ifProdClient = ifElse(isProd && isClient)

  log({
    level: 'info',
    title: 'Webpack',
    message: `Creating ${
      isProd ? 'an optimised' : 'a development'
    } bundle configuration for the "${target}"`,
  })

  const bundleConfig =
    isServer || isClient
      ? config(['bundles', target])
      : config(['additionalNodeBundles', target])

  if (!bundleConfig) {
    throw new Error('No bundle configuration exists for target:', target)
  }

  const localIdentName = ifDev('[name]_[local]_[hash:base64:5]', '[hash:base64:10]')

  let webpackConfig = {
    mode: ifDev('development', 'production'),

    entry: {
      index: clean([
        ifClient('regenerator-runtime/runtime'),
        ifDevClient('react-hot-loader/patch'),
        ifDevClient(
          () =>
            `webpack-hot-middleware/client?reload=true&path=http://${config(
              'host',
            )}:${config('clientDevServerPort')}/__webpack_hmr`,
        ),
        path.resolve(appRootDir.get(), bundleConfig.srcEntryFile),
      ]),
    },

    output: {
      path: path.resolve(appRootDir.get(), bundleConfig.outputPath),
      filename: ifProdClient('[name]-[chunkhash].js', '[name].js'),
      chunkFilename: '[name]-[chunkhash].js',
      libraryTarget: ifNode('commonjs2', 'var'),
      publicPath: ifDev(
        `http://${config('host')}:${config('clientDevServerPort')}${config(
          'bundles.client.webPath',
        )}`,
        bundleConfig.webPath,
      ),
      hotUpdateChunkFilename: '[hash].hot-update.js',
    },

    target: isClient ? 'web' : 'node',

    node: {
      __dirname: true,
      __filename: true,
    },

    devtool: ifElse(
      isNode || isDev || config('includeSourceMapsForOptimisedClientBundle'),
    )('cheap-module-source-map', 'hidden-source-map'),

    performance: ifProdClient({ hints: 'warning' }, false),

    optimization: {
      minimizer: ifProdClient([
        new UglifyJsPlugin({
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
          sourceMap: config('includeSourceMapsForOptimisedClientBundle'),
        }),
      ]),
    },

    resolve: {
      extensions: config('bundleSrcTypes').map(ext => `.${ext}`),
      alias: {
        modernizr$: path.resolve(appRootDir.get(), './.modernizrrc'),
      },
    },

    externals: clean([
      ifNode(() =>
        nodeExternals({
          whitelist: clean(['source-map-support/register']).concat(
            config('nodeExternalsFileTypeWhitelist') || [],
          ),
        }),
      ),
    ]),

    plugins: clean([
      ifNode(
        () =>
          new webpack.BannerPlugin({
            banner: 'require("source-map-support").install();',
            raw: true,
            entryOnly: false,
          }),
      ),

      new webpack.EnvironmentPlugin({
        NODE_ENV: isProd ? 'production' : 'development',
        BUILD_FLAG_IS_CLIENT: JSON.stringify(isClient),
        BUILD_FLAG_IS_SERVER: JSON.stringify(isServer),
        BUILD_FLAG_IS_NODE: JSON.stringify(isNode),
        BUILD_FLAG_IS_DEV: JSON.stringify(isDev),
      }),

      ifClient(
        () =>
          new AssetsPlugin({
            filename: config('bundleAssetsFileName'),
            path: path.resolve(appRootDir.get(), bundleConfig.outputPath),
          }),
      ),

      ifDev(() => new webpack.NoEmitOnErrorsPlugin()),

      ifDev(() => new HardSourceWebpackPlugin()),

      ifDevClient(
        () =>
          new webpack.HotModuleReplacementPlugin({
            multiStep: true,
          }),
      ),

      ifClient(
        () =>
          new ExtractTextPlugin({
            filename: '[name]-[contenthash].css',
            allChunks: false,
          }),
      ),
    ]),

    module: {
      strictExportPresence: true,
      rules: [
        {
          oneOf: clean([
            {
              test: /\.jsx?$/,
              loader: 'babel-loader',
              options: config('plugins.babelConfig')(
                {
                  babelrc: false,
                  presets: clean([
                    'react',
                    'stage-3',
                    ifClient(['@babel/preset-env', { es2015: { modules: false } }]),
                    ifNode(['@babel/preset-env', { targets: { node: true } }]),
                  ]),
                  plugins: clean([
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
              include: clean([
                ...bundleConfig.srcPaths.map(srcPath =>
                  path.resolve(appRootDir.get(), srcPath),
                ),
                ifProdClient(path.resolve(appRootDir.get(), 'src/html')),
                path.resolve(__dirname, '../../lib'),
                path.resolve(__dirname, '../../src'),
              ]),
            },

            ifElse(isClient || isServer)(
              mergeDeep(
                {
                  test: /(\.scss|\.css)$/,
                },
                ifClient(() => ({
                  loaders: [
                    ...ExtractTextPlugin.extract({
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

            ifElse(isClient || isServer)({
              test: /node_modules.*\.css$/,
              use: ifProdClient(
                ExtractTextPlugin.extract({
                  fallback: 'style-loader',
                  use: ['css-loader', 'postcss-loader'],
                }),
                [
                  ...ifNode(['css-loader/locals'], ['style-loader', 'css-loader']),
                  'postcss-loader',
                ],
              ),
            }),

            ifElse(isClient || isServer)(() => ({
              loader: 'file-loader',
              exclude: [/\.js$/, /\.html$/, /\.json$/],
              query: {
                publicPath: isDev
                  ? `http://${config('host')}:${config('clientDevServerPort')}${config(
                    'bundles.client.webPath',
                  )}`
                  : config('bundles.client.webPath'),
                emitFile: isClient,
              },
            })),
          ]),
        },
      ],
    },
  }

  if (isProd && isClient) {
    webpackConfig = withServiceWorker(webpackConfig, bundleConfig)
  }

  return config('plugins.webpackConfig')(webpackConfig, buildOptions)
}
