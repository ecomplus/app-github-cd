'use strict'

// log on files
// const logger = require('console-files')
// https://github.com/octokit/app.js
const App = require('@octokit/app')

// read pem file
const fs = require('fs')
const filename = process.env.GITHUB_APP_KEY
const privateKey = fs.readFileSync(filename, 'utf8')
// debug
// logger.log(privateKey)

const app = new App({
  id: process.env.GITHUB_APP_ID,
  privateKey
})

// returns App instance
module.exports = app
