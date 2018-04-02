#!/usr/bin/env node

const { execSync } = require('child_process')
const path = require('path')

const crossEnvPath = path.resolve(__dirname, '../node_modules/.bin/cross-env')
const babelNodePath = path.resolve(__dirname, '../node_modules/.bin/babel-node')
const devPath = path.resolve(__dirname, '../lib/internal/development')

execSync(`${crossEnvPath} DEPLOYMENT=development ${babelNodePath} ${devPath}`, {
  stdio: 'inherit',
})
