const { execSync } = require('child_process')
const path = require('path')

const babelNodePath = path.resolve(__dirname, '../node_modules/.bin/babel-node')
const devPath = path.resolve(__dirname, '../src/internal/development')
const libPath = path.resolve(__dirname, '..')

execSync(`cross-env DEPLOYMENT=development ${babelNodePath} ${devPath}`, {
  stdio: 'inherit',
})
