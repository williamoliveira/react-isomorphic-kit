import uuid from 'uuid'
import hpp from 'hpp'
import helmet from 'helmet'
import config from '../../config'

const cspConfig = {
  directives: {
    childSrc: ["'self'"],
    connectSrc: ['*'], // ["'self'", 'ws:'],
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

const cspExtensions = config('cspExtensions')
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
      `${config('host')}:${config('clientDevServerPort')}`,
    )
  })
}

function nonceMiddleware(req, res, next) {
  res.locals.nonce = uuid.v4()
  next()
}

const securityMiddleware = [
  nonceMiddleware,
  hpp(),
  helmet.xssFilter(),
  helmet.frameguard('deny'),
  helmet.ieNoOpen(),
  helmet.noSniff(),
  helmet.contentSecurityPolicy(cspConfig),
]

export default securityMiddleware
