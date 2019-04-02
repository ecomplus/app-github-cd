'use strict'

// https://github.com/octokit/app.js
const App = require('@octokit/app')

// read pem file
const fs = require('fs')
const privateKey = fs.readFileSync(process.env.GITHUB_APP_KEY)

const app = new App({
  id: process.env.GITHUB_APP_ID,
  privateKey
})

// returns App instance
module.exports = app
