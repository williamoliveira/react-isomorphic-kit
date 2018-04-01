import { readFile } from 'fs'
import { resolve as pathResolve } from 'path'
import appRootDir from 'app-root-dir'
import config from '../../config'

export default function offlinePageMiddleware(req, res, next) {
  if (typeof res.locals.nonce !== 'string') {
    throw new Error('A "nonce" value has not been attached to the response')
  }
  const nonce = res.locals.nonce

  readFile(
    pathResolve(
      appRootDir.get(),
      config('bundles.client.outputPath'),
      config('serviceWorker.offlinePageFileName'),
    ),
    'utf-8',
    (err, data) => {
      if (err) {
        res.status(500).send('Error returning offline page.')
        return
      }
      const offlinePageWithNonce = data.replace('OFFLINE_PAGE_NONCE_PLACEHOLDER', nonce)
      res.send(offlinePageWithNonce)
    },
  )
}
