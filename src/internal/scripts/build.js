import webpack from 'webpack'
import appRootDir from 'app-root-dir'
import { resolve as pathResolve } from 'path'
import webpackConfigFactory from '../webpack/configFactory'
import { exec } from '../utils'
import config from '../config'

const [x, y, ...args] = process.argv

const optimize = args.findIndex(arg => arg === '--optimize') !== -1

exec(`rimraf ${pathResolve(appRootDir.get(), config('buildOutputPath'))}`)

Object.keys(config('bundles')).forEach((bundleName) => {
  const compiler = webpack(webpackConfigFactory({ target: bundleName, optimize }))
  compiler.run((err, stats) => {
    if (err) {
      console.error(err.stack || err)
      if (err.details) console.error(err.details)
      process.exitCode = process.exitCode || 1
      return
    }

    if (stats.hasErrors()) {
      process.exitCode = process.exitCode || 1
    }

    console.log(stats.toString({ colors: true }))
  })
})
