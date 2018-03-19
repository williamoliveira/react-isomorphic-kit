import * as EnvVars from './utils/envVars'

const values = {
  clientConfigFilter: {
    serviceWorker: {
      enabled: true,
    },
    polyfillIO: true,
    htmlPage: true,
    apiUrl: true,
    socketUrl: true,
    clientId: true,
    clientSecret: true,
    sentryDsn: true,
  },

  apiUrl: EnvVars.string('API_URL', 'http://localhost:8080'),
  socketUrl: EnvVars.string('SOCKET_URL', 'http://localhost:8080'),
  clientId: EnvVars.string('CLIENT_ID', 'api'),
  clientSecret: EnvVars.string('CLIENT_SECRET', 'secret'),
  host: EnvVars.string('HOST', '127.0.0.1'),
  port: EnvVars.number('PORT', 1337),
  baseUrl: EnvVars.string('BASE_URL', ''),
  clientDevServerPort: EnvVars.number('CLIENT_DEV_PORT', 7331),
  sentryDsn: EnvVars.number('SENTRY_DSN'),

  disableSSR: false,
  browserCacheMaxAge: '365d',
  polyfillIO: {
    enabled: process.env.NODE_ENV !== 'development',
    url: '//cdn.polyfill.io/v2/polyfill.min.js',
    features: ['default', 'es6'],
  },
  htmlPage: {
    titleTemplate: 'Memult - %s',
    defaultTitle: 'Memult',
    description: 'Marketing Empresarial Multicanal',
  },
  cspExtensions: {
    childSrc: [],
    connectSrc: [],
    defaultSrc: [],
    fontSrc: ['fonts.googleapis.com/css', 'fonts.gstatic.com'],
    imgSrc: [
      EnvVars.string('MEDIA_HOST'),
      'unpkg.com',
      'cdnjs.cloudflare.com',
      'twemoji.maxcdn.com',
      'data:',
      'blob:',
    ],
    mediaSrc: [EnvVars.string('MEDIA_HOST'), 'blob:'],
    manifestSrc: [],
    objectSrc: [],
    scriptSrc: ['cdn.polyfill.io'],
    styleSrc: ['fonts.googleapis.com/css'],
  },
  publicAssetsPath: './public',
  buildOutputPath: './build',
  includeSourceMapsForOptimisedClientBundle: false,
  bundleSrcTypes: ['js', 'jsx', 'json'],
  bundleAssetsFileName: 'assets.json',
  nodeExternalsFileTypeWhitelist: [
    /\.(eot|woff|woff2|ttf|otf)$/,
    /\.(svg|png|jpg|jpeg|gif|ico)$/,
    /\.(mp4|mp3|ogg|swf|webp)$/,
    /\.(css|scss|sass|sss|less)$/,
  ],
  serviceWorker: {
    enabled: true,
    fileName: 'sw.js',
    includePublicAssets: ['./**/*'],
    offlinePageFileName: 'offline.html',
  },

  bundles: {
    client: {
      srcEntryFile: './src/client/index.js',
      srcPaths: ['./src/client', './src/app', './config'],
      outputPath: './build/client',
      webPath: '/client/',
      devVendorDLL: {
        enabled: true,
        include: [
          'assign-deep',
          'axios',
          'bootstrap',
          'classnames',
          'date-fns',
          'emoji-mart',
          'favico.js',
          'font-awesome',
          'history',
          'lodash',
          'md5',
          'modernizr',
          'moize',
          'moment',
          'prop-types',
          'prop-types-extra',
          'qs',
          'react',
          'react-datetime',
          'react-dom',
          'react-easy-emoji',
          'react-helmet',
          'react-image-lightbox',
          'react-linkify',
          'react-redux',
          'react-reformed',
          'react-router',
          'react-router-dom',
          'react-router-redux',
          'react-select',
          'react-ultimate-pagination-bootstrap-4',
          'react-virtualized',
          'reactstrap',
          'recompose',
          'redux',
          'redux-act-light',
          'redux-logger',
          'redux-persist',
          'redux-saga',
          'reselect',
          'socket.io-client',
          'string-mask',
          'uuid',
        ],
        name: '__dev_vendor_dll__',
      },
    },

    server: {
      srcEntryFile: './src/server/index.js',
      srcPaths: ['./src/server', './src/app', './config'],
      outputPath: './build/server',
    },
  },
  plugins: {
    babelConfig: (babelConfig, buildOptions) => {
      const { target, mode } = buildOptions

      babelConfig.plugins.push('transform-class-properties')
      babelConfig.plugins.push('react-flow-props-to-prop-types')

      return babelConfig
    },
    webpackConfig: (webpackConfig, buildOptions) => {
      const { target, mode } = buildOptions

      return webpackConfig
    },
  },
}

if (process.env.BUILD_FLAG_IS_CLIENT === 'true') {
  throw new Error(
    "You shouldn't be importing the `/config/values.js` directly into code that will be included in your 'client' bundle as the configuration object will be sent to user's browsers. This could be a security risk! Instead, use the `config` helper function located at `/config/index.js`.",
  )
}

export default values
