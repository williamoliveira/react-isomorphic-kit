import get from 'lodash/get'

let configCache

function resolveConfigForBrowserOrNode() {
  if (configCache) return configCache

  if (
    typeof process.env.BUILD_FLAG_IS_NODE === 'undefined' ||
    process.env.BUILD_FLAG_IS_NODE === 'true'
  ) {
    configCache = require('./values').default
    return configCache
  }

  if (typeof window !== 'undefined' && typeof window.__CLIENT_CONFIG__ === 'object') {
    configCache = window.__CLIENT_CONFIG__
  } else {
    console.warn('No client configuration object was bound to the window.')
    configCache = {}
  }

  return configCache
}

export default function (path) {
  const config = resolveConfigForBrowserOrNode()

  return get(config, path)
}
