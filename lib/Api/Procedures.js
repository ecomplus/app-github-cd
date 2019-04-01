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
        'subresource': null,
        'method': 'POST',
        'field': 'slug'
      },
      {
        'resource': 'categories',
        'subresource': null,
        'method': 'DELETE'
      },
      {
        'resource': 'categories',
        'subresource': null,
        'action': 'change',
        'field': 'slug'
      },
      {
        'resource': 'brands',
        'subresource': null,
        'method': 'POST',
        'field': 'slug'
      },
      {
        'resource': 'brands',
        'subresource': null,
        'method': 'DELETE'
      },
      {
        'resource': 'brands',
        'subresource': null,
        'action': 'change',
        'field': 'slug'
      },
      {
        'resource': 'collections',
        'subresource': null,
        'method': 'POST',
        'field': 'slug'
      },
      {
        'resource': 'collections',
        'subresource': null,
        'method': 'DELETE'
      },
      {
        'resource': 'collections',
        'subresource': null,
        'action': 'change',
        'field': 'slug'
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
