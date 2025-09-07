// server/src/config/schema.js
// Build and validate application configuration from environment variables.

function toInt(value, fallback) {
  const n = parseInt(String(value), 10)
  return Number.isFinite(n) ? n : fallback
}

function parseOrigins(value) {
  if (!value) return []
  return String(value)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

function assert(cond, msg) {
  if (!cond) throw new Error(`Config: ${msg}`)
}

function buildConfig(env) {
  const nodeEnv = env.NODE_ENV || "development"
  const isProd = nodeEnv === "production"

  const config = {
    server: {
      nodeEnv,
      port: toInt(env.PORT, 8080),
    },
    db: {
      host: env.DB_HOST || "127.0.0.1",
      port: toInt(env.DB_PORT, 3306),
      name: env.DB_NAME || "fictionbook",
      user: env.DB_USER || "root",
      pass: env.DB_PASS || "",
      dialect: env.DB_DIALECT || "mysql",
      timezone: env.DB_TIMEZONE || "+07:00",
    },
    auth: {
      jwtSecret: env.JWT_SECRET,
      jwtExpiresIn: env.JWT_EXPIRES_IN || "7d",
    },
    cors: {
      allowedOrigins: parseOrigins(env.CLIENT_ORIGINS || env.CLIENT_ORIGIN),
    },
    email: {
      host: env.EMAIL_HOST,
      port: toInt(env.EMAIL_PORT, 587),
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
      from:
        env.EMAIL_FROM_ADDRESS || '"Fiction Book" <no-reply@fictionbook.com>',
    },
    clientUrl: env.CLIENT_URL || "http://localhost:5173",
  }

  // Basic validations
  assert(Number.isInteger(config.server.port), "PORT must be an integer")
  assert(Number.isInteger(config.db.port), "DB_PORT must be an integer")
  if (isProd) {
    assert(config.auth.jwtSecret, "JWT_SECRET is required in production")
  }

  return Object.freeze(config)
}

module.exports = { buildConfig }

