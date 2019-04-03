'use strict'

// GitHub API client
const request = require('@octokit/request')
// app instance
const app = require('./app')

const makeId = (length = 16) => {
  // generate random string
  let text = ''
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

module.exports = async (installation, owner, repo, content, token) => {
  // https://github.com/octokit/app.js#authenticating-as-an-installation
  if (!token) {
    let installationId = installation.id
    token = await app.getInstallationAccessToken({ installationId })
  }
  // create or update JSON file content to trigger new deploy cicle
  let path = installation.single_file_name || '.ecomplus.cd.json'
  if (!content) {
    // generate random hash
    content = { rand: makeId() }
  }
  content = JSON.stringify(content, null, 2)

  // send request to GitHub Content API
  // get current JSON file if exists
  const params = {
    owner,
    repo,
    path,
    headers: {
      authorization: `token ${token}`,
      accept: 'application/vnd.github.machine-man-preview+json'
    }
  }
  let sha
  try {
    const { data } = await request('GET /repos/:owner/:repo/contents/:path', params)
    if (data) {
      sha = data.sha
    }
  } catch (e) {
    // file not found ?
    // ignore
  }

  // setup body for the commit
  const commit = {
    ...params,
    headers: {
      authorization: `token ${token}`,
      accept: 'application/vnd.github.machine-man-preview+json'
    },
    message: 'chore: E-Com Plus trigger deploy (bot)',
    content
  }
  if (sha) {
    // update file
    // need to provide the blob SHA of the file being replaced
    commit.sha = sha
  }
  await request('PUT /repos/:owner/:repo/contents/:path', commit)
}
