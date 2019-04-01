# app-github-cd

Updates store GitHub repo after procedures to handle CD

## Environment variables sample

Variable              | Value
---                   | ---
`LOGGER_OUTPUT`       | `~/app/log/logger.out`
`LOGGER_ERRORS`       | `~/app/log/logger.err`
`LOGGER_FATAL_ERRORS` | `~/app/log/_stderr`
`PROXY_PORT`          | `3000`
`PROXY_AUTH`          | `auth_token`
`GITHUB_APP_ID`       | `1234`
`GITHUB_APP_KEY`      | `~/app/github-app.private-key.pem`
`ECOM_AUTH_DB`        | `~/app/db.sqlite`
`APP_BASE_URI`        | `https://app.ecomplus.biz/api/v1`
