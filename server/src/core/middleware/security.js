const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const helmetMiddleware = helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } });

const createLimiter = ({ windowMs = 15 * 60 * 1000, max = 100 } = {}) =>
  rateLimit({ windowMs, max, standardHeaders: true, legacyHeaders: false });

module.exports = { helmetMiddleware, createLimiter };


