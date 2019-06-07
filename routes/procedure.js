'use strict'

// import trigger deploy function
const triggerDeploy = require('./../lib/GitHub/TriggerDeploy')
// read configured E-Com Plus app data
const getConfig = require('./../lib/Api/GetConfig')
// GitHub App instance
const app = require('./../lib/GitHub/App')
// https://github.com/octokit/app.js#authenticating-as-an-app
const request = require('@octokit/request')

const POST = (id, meta, trigger, respond, storeId, appSdk) => {
  // mount content for JSON file from trigger body
  let content = {
    trigger: trigger._id,
    resource: trigger.resource,
    slug: (trigger.body && trigger.body.slug) || null
  }

  // get repo and owner from E-Com Plus application data
  getConfig({ appSdk, storeId }).then(async ({ owner, repo }) => {
    if (owner && repo) {
      // cached authentication token
      const jwt = app.getSignedJsonWebToken()
      // get installation object for current owner/repo
      // https://developer.github.com/v3/apps/#find-repository-installation
      const { data } = await request('GET /repos/:owner/:repo/installation', {
        owner,
        repo,
        headers: {
          authorization: `Bearer ${jwt}`,
          accept: 'application/vnd.github.machine-man-preview+json'
        }
      })

      // try to trigger deploy and end HTTP request
      triggerDeploy(data, owner, repo, content).then(() => {
        // end current request with success
        respond('CD_SUCCESS')
      }).catch(err => {
        // return error code to receive webhook again further
        respond({}, null, 500, 'CD_ERR', err.code + ': ' + err.message)
      })
    } else {
      // undefined GitHub repo
      respond({}, null, 400, 'NO_GITHUB_REPO')
    }
  })

    .catch(err => {
      // cannot readt app data
      // return error status code
      respond({}, null, 500, 'APP_ERR', err.message)
    })
}

module.exports = {
  POST
}
