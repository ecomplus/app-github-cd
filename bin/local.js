'use strict'

if (process.env.SCHEDULED_DEPLOYS === 'true' || process.env.SCHEDULED_DEPLOYS === true) {
  // log on files
  const logger = require('console-files')
  // handle app authentication to Store API
  // https://github.com/ecomclub/ecomplus-app-sdk
  const { ecomAuth } = require('ecomplus-app-sdk')

  ecomAuth.then(appSdk => {
    // configure setup for stores
    // list of procedures to save
    const procedures = require('./../lib/Api/Procedures')
    appSdk.configureSetup(procedures, (err, { storeId }) => {
      if (!err) {
        logger.log('Setup store #' + storeId)
      } else if (!err.appAuthRemoved) {
        logger.error(err)
      }
    })
    // debug
    logger.log('Stores setup (procedures) configured')
  })

  ecomAuth.catch(err => {
    logger.error(err)
    setTimeout(() => {
      // destroy Node process while Store API auth cannot be handled
      process.exit(1)
    }, 1000)
  })

  const scheduledDeploy = () => {
    logger.log('--> Scheduled deploy')
    // list all GitHub app installations from API
    // https://github.com/octokit/app.js#authenticating-as-an-app
    const request = require('@octokit/request')
    // import App instance
    const app = require('./../lib/GitHub/App')

    // chached authentication token
    const jwt = app.getSignedJsonWebToken()
    logger.log(jwt)

    ;(async function apiRequest () {
      // https://developer.github.com/v3/apps/#find-installations
      const { data } = await request('GET /app/installations', {
        headers: {
          authorization: `Bearer ${jwt}`,
          accept: 'application/vnd.github.machine-man-preview+json'
        }
      })
      logger.log(data)

      if (Array.isArray(data)) {
        data.forEach(installation => {
          //
        })
      }
    }())
  }

  // debug
  logger.log('Start scheduled deploy')
  scheduledDeploy()

  // trigger deploy every day at 03:00
  // https://www.npmjs.com/package/node-schedule
  require('node-schedule').scheduleJob('0 0 3 * *', scheduledDeploy)
}
