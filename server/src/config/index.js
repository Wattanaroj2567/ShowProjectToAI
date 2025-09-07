// server/src/config/index.js
// Single source of truth for configuration.

require("dotenv").config()
const { buildConfig } = require("./schema")

module.exports = buildConfig(process.env)

