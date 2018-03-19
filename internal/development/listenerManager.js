const { log } = require('../utils')

class ListenerManager {
  constructor(listener, name) {
    this.name = name || 'listener'
    this.lastConnectionKey = 0
    this.connectionMap = {}
    this.listener = listener

    this.listener.on('connection', (connection) => {
      this.lastConnectionKey += 1
      const connectionKey = this.lastConnectionKey
      this.connectionMap[connectionKey] = connection
      connection.on('close', () => {
        delete this.connectionMap[connectionKey]
      })
    })
  }

  killAllConnections() {
    Object.keys(this.connectionMap).forEach((connectionKey) => {
      this.connectionMap[connectionKey].destroy()
    })
  }

  dispose() {
    return new Promise((resolve) => {
      if (this.listener) {
        this.killAllConnections()

        log({
          title: this.name,
          level: 'info',
          message: 'Destroyed all existing connections.',
        })

        this.listener.close(() => {
          log({
            title: this.name,
            level: 'info',
            message: 'Closed listener.',
          })

          resolve()
        })
      } else {
        resolve()
      }
    })
  }
}

export default ListenerManager
