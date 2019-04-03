'use strict'

// log on files
const logger = require('console-files')

module.exports = ({ appSdk, storeId, auth }) => {
  // read configured options from app data
  return new Promise(resolve => {
    appSdk.appPublicBody(storeId, auth).then(({ response }) => {
      // https://developers.e-com.plus/docs/api/#/store/applications/applications
      const appConfig = response.data.data || {}
      resolve({ appConfig })
    })

      .catch(err => {
        // cannot GET current application
        // debug error
        logger.error(err)
      })
  })
}
