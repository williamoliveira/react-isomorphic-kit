

const OfflinePluginRuntime = require('offline-plugin/runtime')

OfflinePluginRuntime.install({
  onUpdating: () => undefined,
  onUpdateReady: () => OfflinePluginRuntime.applyUpdate(),
  onUpdated: () => window.location.reload(),
  onUpdateFailed: () => undefined,
})
