'use strict'

// log on files
const logger = require('console-files')

module.exports = ({ appSdk, storeId }) => {
  // read configured options from app data
  // https://developers.e-com.plus/docs/api/#/store/applications/applications
  return appSdk.appPublicBody(storeId)

    .then(({ response }) => {
      // return app data object
      return response.data.data || {}
    })

    .catch(err => {
      // cannot GET current application
      // debug error
      logger.error(err)
    })
}
