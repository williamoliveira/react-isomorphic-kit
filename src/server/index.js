import express from 'express'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import { resolve as pathResolve } from 'path'
import appRootDir from 'app-root-dir'
import requireFromUserland from '../../internal/utils/requireFromUserland'
import security from './middlewares/security'
import clientBundle from './middlewares/clientBundle'
import serviceWorker from './middlewares/serviceWorker'
import offlinePage from './middlewares/offlinePage'
import errorHandlers from './middlewares/errorHandlers'
import config from '../../config'

const reactApplication = requireFromUserland('src/server')

const app = express()

app.disable('x-powered-by')
app.use(...security)
app.use(cookieParser())
app.use(compression())

if (process.env.BUILD_FLAG_IS_DEV === 'false' && config('serviceWorker.enabled')) {
  app.get(`/${config('serviceWorker.fileName')}`, serviceWorker)
  app.get(
    `${config('bundles.client.webPath')}${config('serviceWorker.offlinePageFileName')}`,
    offlinePage,
  )
}

app.use(config('bundles.client.webPath'), clientBundle)
app.use(express.static(pathResolve(appRootDir.get(), config('publicAssetsPath'))))
app.get('*', (request, response) => {
  console.log(`REQUEST: Received for "${request.url}"`)
  return reactApplication(request, response)
})
app.use(...errorHandlers)

const listener = app.listen(config('port'), () =>
  console.log(`✓ ${config('htmlPage.defaultTitle')} is ready!
Service Workers: ${config('serviceWorker.enabled')}
Polyfills: ${config('polyfillIO.enabled')} (${config('polyfillIO.features').join(', ')})
Server is now listening on Port ${config('port')}
You can access it in the browser at http://${config('host')}:${config('port')}
Press Ctrl-C to stop.
`),
)

export default listener
