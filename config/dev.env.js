'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  VUE_APP_TIMEZONEDB_API_KEY: '"YOUR_TIMEZONEDB_API_KEY"', // insert your YOUR_TIMEZONEDB_API_KEY
  VUE_APP_GOOGLE_MAP_API_KEY: '"YOUR_GOOGLE_API_KEY"', // insert your YOUR_GOOGLE_API_KEY 
})
