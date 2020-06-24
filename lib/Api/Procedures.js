'use strict'

// APP hostname and base URL path
const appBaseUri = process.env.APP_BASE_URI
// APP name to procedures titles
const appName = 'GitHub Storefront CD'

module.exports = [
  {
    'title': appName,
    'triggers': [
      {
        'resource': 'products',
        'subresource': null,
        'method': 'POST',
        'field': 'slug'
      },
      {
        'resource': 'products',
        'subresource': null,
        'method': 'DELETE'
      },
      {
        'resource': 'products',
        'subresource': null,
        'action': 'change',
        'field': 'slug'
      },
      {
        'resource': 'categories',
        'subresource': null
      },
      {
        'resource': 'brands',
        'subresource': null
      },
      {
        'resource': 'collections',
        'subresource': null
      }
    ],
    'webhooks': [
      {
        'api': {
          'external_api': {
            'uri': appBaseUri + '/procedure.json'
          }
        },
        'method': 'POST'
      }
    ]
  }
]
