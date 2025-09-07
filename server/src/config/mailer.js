// src/config/mailer.js
const nodemailer = require("nodemailer");
const debug = require("debug")("fictionbook:mailer");
const config = require("./index");

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: Number(config.email.port) === 465,
  auth: config.email.user
    ? { user: config.email.user, pass: config.email.pass }
    : undefined,
});

async function sendEmail({ to, subject, html }) {
  debug("Attempting to send email to:", to);
  await transporter.sendMail({
    from: config.email.from,
    to,
    subject,
    html,
  });
  debug("Email sent to:", to);
}

module.exports = { sendEmail, transporter };
