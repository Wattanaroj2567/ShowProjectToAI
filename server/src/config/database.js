// server/src/config/database.js
const { Sequelize } = require("sequelize")
const config = require("./index")

const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.pass,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: config.db.dialect || "mysql",
    timezone: config.db.timezone || "+07:00",
    logging: false,
    define: { timestamps: true },
    pool: { max: 10, min: 0, acquire: 60000, idle: 10000 },
    dialectOptions: { connectTimeout: 60000 },
  }
)

module.exports = { sequelize }

