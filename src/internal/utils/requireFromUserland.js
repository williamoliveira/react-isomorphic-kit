import { resolve as pathResolve } from 'path'
import appRootDir from 'app-root-dir'

export default relative => pathResolve(appRootDir.get(), relative)

if (process.env.BUILD_FLAG_IS_CLIENT === 'true') {
  throw new Error("This file shouldn't be imported on client side code")
}
