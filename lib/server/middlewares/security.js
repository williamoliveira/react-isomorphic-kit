

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = void 0

const _uuid = _interopRequireDefault(require('uuid'))

const _hpp = _interopRequireDefault(require('hpp'))

const _helmet = _interopRequireDefault(require('helmet'))

const _config = _interopRequireDefault(require('../../../config'))

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

const cspConfig = {
  directives: {
    childSrc: ["'self'"],
    connectSrc: ['*'],
    // ["'self'", 'ws:'],
    defaultSrc: ["'self'"],
    imgSrc: ["'self'"],
    fontSrc: ["'self'", 'data:'],
    objectSrc: ["'self'"],
    mediaSrc: ["'self'"],
    manifestSrc: ["'self'"],
    scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`, "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'", 'blob:'],
  },
}
const cspExtensions = (0, _config.default)('cspExtensions')
Object.keys(cspExtensions).forEach((key) => {
  if (cspConfig.directives[key]) {
    cspConfig.directives[key] = cspConfig.directives[key].concat(cspExtensions[key])
  } else {
    cspConfig.directives[key] = cspExtensions[key]
  }
})

if (process.env.BUILD_FLAG_IS_DEV === 'true') {
  Object.keys(cspConfig.directives).forEach((directive) => {
    cspConfig.directives[directive].push(
      `${(0, _config.default)('host')}:${(0, _config.default)('clientDevServerPort')}`,
    )
  })
}

function nonceMiddleware(req, res, next) {
  res.locals.nonce = _uuid.default.v4()
  next()
}

const securityMiddleware = [
  nonceMiddleware,
  (0, _hpp.default)(),
  _helmet.default.xssFilter(),
  _helmet.default.frameguard('deny'),
  _helmet.default.ieNoOpen(),
  _helmet.default.noSniff(),
  _helmet.default.contentSecurityPolicy(cspConfig),
]
const _default = securityMiddleware
exports.default = _default
