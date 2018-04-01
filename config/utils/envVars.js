import appRootDir from 'app-root-dir'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import ifElse from '../../internal/utils/logic/ifElse'
import clean from '../../internal/utils/arrays/clean'

function registerEnvFile() {
  const DEPLOYMENT = process.env.DEPLOYMENT
  const envFile = '.env'

  const envFileResolutionOrder = clean([
    path.resolve(appRootDir.get(), envFile),
    ifElse(DEPLOYMENT)(path.resolve(appRootDir.get(), `${envFile}.${DEPLOYMENT}`)),
  ])

  const envFilePath = envFileResolutionOrder.find(filePath => fs.existsSync(filePath))

  if (envFilePath) {
    console.log(`==> Registering environment variables from: ${envFilePath}`)
    dotenv.config({ path: envFilePath })
  }
}

registerEnvFile()

export function string(name, defaultVal) {
  return process.env[name] || defaultVal
}

export function number(name, defaultVal) {
  return process.env[name] ? parseInt(process.env[name], 10) : defaultVal
}

export function bool(name, defaultVal) {
  return process.env[name]
    ? process.env[name] === 'true' || process.env[name] === '1'
    : defaultVal
}
