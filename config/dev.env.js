'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API_URL: '"https://demo-sppapi.zimalab.com"',
  BASE_REDIRECT_URL: '"https://admin.demo-spp.zimalab.com/login?refresh_token="',
})
