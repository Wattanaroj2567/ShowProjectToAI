// server/src/email/transporter.js
const nodemailer = require("nodemailer")
const config = require("../config")

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: Number(config.email.port) === 465,
  auth: config.email.user
    ? { user: config.email.user, pass: config.email.pass }
    : undefined,
})

module.exports = { transporter }

