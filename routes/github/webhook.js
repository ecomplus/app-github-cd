'use strict'

const POST = (id, meta, body, respond) => {
  // not using GitHub webhooks
  // nothing to do
  respond(id)
}

module.exports = {
  POST
}
