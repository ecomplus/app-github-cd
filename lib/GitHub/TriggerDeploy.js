'use strict'

// log on files
const logger = require('console-files')
// GitHub API client
const request = require('@octokit/request')
// app instance
const app = require('./App')

const makeId = (length = 16) => {
  // generate random string
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

const queue = {}
const queueSlugs = {}
const recentTriggers = {}

const addToQueue = (installationId, owner, repo, content, token, path) => {
  const repository = `${owner}/${repo}`
  const delay = recentTriggers[repository] ? 1000 * 60 * 2 : 10
  if (content && content.slug) {
    if (!queueSlugs[repository]) {
      queueSlugs[repository] = [content.slug]
    } else if (!queueSlugs[repository].includes(content.slug)) {
      queueSlugs[repository].push(content.slug)
    }
  }

  setTimeout(() => {
    let queueItem = queue[repository]
    const isQueued = Boolean(queueItem)
    if (isQueued) {
      clearTimeout(queueItem.timer)
    }
    queueItem = queue[repository] = { content, token }

    queueItem.timer = setTimeout(async () => {
      delete queue[repository]
      // delay upcoming deploys
      clearTimeout(recentTriggers[repository])
      recentTriggers[repository] = setTimeout(() => {
        delete recentTriggers[repository]
      }, 1000 * 5 * 60)

      let { content, token } = queueItem
      if (!content) {
        // generate random hash
        content = { rand: makeId() }
      } else if (queueSlugs[repository] && queueSlugs[repository].length) {
        // join multiple slugs if any
        content.slug = queueSlugs[repository].join(',')
        delete queueSlugs[repository]
      }

      // https://github.com/octokit/app.js#authenticating-as-an-installation
      if (!token) {
        try {
          token = await app.getInstallationAccessToken({ installationId })
        } catch (err) {
          err.repository = repository
          logger.error(err)
          return
        }
      }

      // parse content to Base64 string
      const buff = Buffer.from(JSON.stringify(content, null, 2), 'utf8')
      content = buff.toString('base64')
      // logger.log(content)

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
        message: 'chore: trigger deploy (bot)',
        content
      }
      if (sha) {
        // update file
        // need to provide the blob SHA of the file being replaced
        commit.sha = sha
      }
      request('PUT /repos/:owner/:repo/contents/:path', commit).catch(err => {
        logger.error(err)
      })
      logger.log(`https://github.com/${repository}`)
    }, 1000 * (isQueued ? 90 : 60))
  }, delay)
}

async function triggerDeploy (installation, owner, repo, content, token) {
  // create or update JSON file content to trigger new deploy cicle
  const path = installation.single_file_name
  if (path) {
    addToQueue(installation.id, owner, repo, content, token, path)
  }
}

module.exports = triggerDeploy
