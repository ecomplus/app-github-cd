'use strict'

const pkg = require('./../package.json')

const GET = (id, meta, trigger, respond) => {
  respond(pkg.version)
}

module.exports = {
  GET
}
