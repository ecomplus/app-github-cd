'use strict'

// log on files
const logger = require('console-files')

module.exports = ({ appSdk, storeId, auth }) => {
  // read configured options from app data
  // https://developers.e-com.plus/docs/api/#/store/applications/applications
  return appSdk.appPublicBody(storeId, auth)

    .then(({ response }) => {
      // app data object
      const appConfig = response.data.data || {}
      return { appConfig }
    })

    .catch(err => {
      // cannot GET current application
      // debug error
      logger.error(err)
    })
}
