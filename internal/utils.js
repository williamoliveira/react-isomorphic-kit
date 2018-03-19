import os from 'os'
import notifier from 'node-notifier'
import chalk from 'chalk'
import { execSync } from 'child_process'
import appRootDir from 'app-root-dir'

export function log(options) {
  const title = `${options.title.toUpperCase()}`

  if (options.notify) {
    notifier.notify({
      title,
      message: options.message,
    })
  }

  const level = options.level || 'info'
  const msg = `${title}: ${options.message}`

  switch (level) {
    case 'warn':
      console.log(chalk.yellow(msg))
      break
    case 'error':
      console.log(chalk.bgRed.white.bold(msg))
      break
    case 'special':
      console.log(chalk.italic.cyanBright(msg))
      break
    case 'info':
    default:
      console.log(chalk.green(msg))
  }
}

export function exec(command) {
  execSync(command, { stdio: 'inherit', cwd: appRootDir.get() })
}
