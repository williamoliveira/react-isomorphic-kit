import webpack from 'webpack'
import { resolve as pathResolve } from 'path'
import appRootDir from 'app-root-dir'
import md5 from 'md5'
import fs from 'fs'
import config from '../../config'
import { log } from '../utils'

function createVendorDLL(bundleName, bundleConfig) {
  const dllConfig = config('bundles.client.devVendorDLL')
  const pkg = require(pathResolve(appRootDir.get(), './package.json'))
  const devDLLDependencies = dllConfig.include.sort()

  const currentDependenciesHash = md5(
    JSON.stringify(
      devDLLDependencies.map(dep => [
        dep,
        pkg.dependencies[dep],
        pkg.devDependencies[dep],
      ]),
    ),
  )

  const vendorDLLHashFilePath = pathResolve(
    appRootDir.get(),
    bundleConfig.outputPath,
    `${dllConfig.name}_hash`,
  )

  function webpackConfigFactory() {
    return {
      mode: 'development',
      devtool: 'inline-source-map',
      entry: {
        [dllConfig.name]: devDLLDependencies,
      },
      output: {
        path: pathResolve(appRootDir.get(), bundleConfig.outputPath),
        filename: `${dllConfig.name}.js`,
        library: dllConfig.name,
      },
      plugins: [
        new webpack.DllPlugin({
          path: pathResolve(
            appRootDir.get(),
            bundleConfig.outputPath,
            `./${dllConfig.name}.json`,
          ),
          name: dllConfig.name,
        }),
      ],
    }
  }

  function buildVendorDLL() {
    return new Promise((resolve, reject) => {
      const webpackConfig = webpackConfigFactory()
      const vendorDLLCompiler = webpack(webpackConfig)
      vendorDLLCompiler.run((err) => {
        if (err) {
          reject(err)
          return
        }

        try {
          fs.writeFileSync(vendorDLLHashFilePath, currentDependenciesHash)
        } catch (err2) {
          reject(err2)
          return
        }

        log({
          title: 'vendorDLL',
          level: 'info',
          message: `Vendor DLL build complete. The following dependencies have been included:\n\t-${devDLLDependencies.join(
            '\n\t-',
          )}\n`,
        })

        resolve()
      })
    })
  }

  return new Promise((resolve, reject) => {
    if (!fs.existsSync(vendorDLLHashFilePath)) {
      log({
        title: 'vendorDLL',
        level: 'warn',
        message: `Generating a new "${bundleName}" Vendor DLL for boosted development performance.
The Vendor DLL helps to speed up your development workflow by reducing Webpack build times.  It does this by seperating Vendor DLLs from your primary bundles, thereby allowing Webpack to ignore them when having to rebuild your code for changes.  We recommend that you add all your client bundle specific dependencies to the Vendor DLL configuration (within /config).`,
      })
      buildVendorDLL()
        .then(resolve)
        .catch(reject)
    } else {
      const dependenciesHash = fs.readFileSync(vendorDLLHashFilePath, 'utf8')
      const dependenciesChanged = dependenciesHash !== currentDependenciesHash

      if (dependenciesChanged) {
        log({
          title: 'vendorDLL',
          level: 'warn',
          message: `New "${bundleName}" vendor dependencies detected. Regenerating the vendor dll...`,
        })
        buildVendorDLL()
          .then(resolve)
          .catch(reject)
      } else {
        log({
          title: 'vendorDLL',
          level: 'info',
          message: `No changes to existing "${bundleName}" vendor dependencies. Using the existing vendor dll.`,
        })
        resolve()
      }
    }
  })
}

export default createVendorDLL
