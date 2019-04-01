'use strict'

// log on files
const logger = require('console-files')

const POST = (id, meta, body, respond, storeId, appSdk) => {
  // Store API authentication callback
  appSdk.handleCallback(storeId, body).then(() => {
    // just respond first
    respond(null, null, 204)
  })

    .catch(err => {
      if (typeof err.code === 'string' && !err.code.startsWith('SQLITE_CONSTRAINT')) {
        // debug SQLite errors
        logger.error(err)
      }
      respond({}, null, 500, 'cpm_callback_error', err.message)
    })
}

module.exports = {
  POST
}
