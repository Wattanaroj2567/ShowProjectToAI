// src/config/mailer.js
// Backward-compatible email helper. Prefer using `src/email/transporter.js`.
const debug = require("debug")("fictionbook:mailer")
const config = require("../config")
const { transporter } = require("../email/transporter")

// Send email via configured transporter
async function sendEmail({ to, subject, html }) {
  debug("Attempting to send email to:", to)
  await transporter.sendMail({
    from: config.email.from,
    to,
    subject,
    html,
  })
  debug("Email sent:", to)
}

module.exports = { sendEmail }
