import { resolve as pathResolve } from 'path'
import webpack from 'webpack'
import appRootDir from 'app-root-dir'
import { log } from '../utils'
import HotNodeServer from './hotNodeServer'
import HotClientServer from './hotClientServer'
import createVendorDLL from './createVendorDLL'
import webpackConfigFactory from '../webpack/configFactory'
import config from '../../config'
import values from '../../config/values'

const usesDevVendorDLL = bundleConfig =>
  bundleConfig.devVendorDLL != null && bundleConfig.devVendorDLL.enabled

const vendorDLLsFailed = (err) => {
  log({
    title: 'vendorDLL',
    level: 'error',
    message:
      'Unfortunately an error occured whilst trying to build the vendor dll(s) used by the development server. Please check the console for more information.',
    notify: true,
  })
  if (err) {
    console.error(err)
  }
}

const initializeBundle = (name, bundleConfig) => {
  const createCompiler = () => {
    try {
      const webpackConfig = webpackConfigFactory({
        target: name,
        mode: 'development',
      })
      if (name === 'client' && usesDevVendorDLL(bundleConfig)) {
        webpackConfig.plugins.push(
          new webpack.DllReferencePlugin({
            manifest: require(pathResolve(
              appRootDir.get(),
              bundleConfig.outputPath,
              `${bundleConfig.devVendorDLL.name}.json`,
            )),
          }),
        )
      }
      return webpack(webpackConfig)
    } catch (err) {
      log({
        title: 'development',
        level: 'error',
        message:
          'Webpack config is invalid, please check the console for more information.',
        notify: true,
      })
      console.error(err)
      throw err
    }
  }

  return { name, bundleConfig, createCompiler }
}

class HotDevelopment {
  constructor(port, clientPort) {
    this.hotClientServer = null
    this.hotNodeServers = []

    values.clientDevServerPort = clientPort
    process.env.PORT = port
    process.env.CLIENT_DEV_PORT = clientPort

    const clientBundle = initializeBundle('client', config('bundles.client'))
    const nodeBundles = [initializeBundle('server', config('bundles.server'))]

    Promise.resolve(
      usesDevVendorDLL(config('bundles.client'))
        ? createVendorDLL('client', config('bundles.client'))
        : true,
    )
      .then(
        () =>
          new Promise((resolve) => {
            const { createCompiler } = clientBundle
            const compiler = createCompiler()
            compiler.plugin('done', (stats) => {
              if (!stats.hasErrors()) {
                resolve(compiler)
              }
            })
            this.hotClientServer = new HotClientServer(clientPort, compiler)
          }),
        vendorDLLsFailed,
      )
      .then((clientCompiler) => {
        this.hotNodeServers = nodeBundles.map(
          ({ name, createCompiler }) =>
            new HotNodeServer(port, name, createCompiler(), clientCompiler),
        )
      })
  }

  dispose() {
    const safeDisposer = server => (server ? server.dispose() : Promise.resolve())

    return safeDisposer(this.hotClientServer).then(() =>
      Promise.all(this.hotNodeServers.map(safeDisposer)),
    )
  }
}

export default HotDevelopment
