'use strict'

const GET = (id, meta, body, respond) => {
  // not using GitHub OAuth
  // nothing to do
  respond(id)
}

module.exports = {
  GET
}
