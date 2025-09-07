require("dotenv").config()
const debug = require("debug")("fictionbook:server")
const errorLog = require("debug")("fictionbook:error")
const express = require("express")
const path = require("path")
const passport = require("passport")
const dns = require("dns").promises

const config = require("./src/config")
const { sequelize } = require("./src/db/sequelize")

require("./src/model-registry")
require("./src/auth/passport-setup.js")

const authRoutes = require("./src/features/auth/auth-routes")
const userRoutes = require("./src/features/users/user-routes")
const bookRoutes = require("./src/features/books/book-routes")
const reviewRoutes = require("./src/features/reviews/review-routes")

const corsMiddleware = require("./src/core/middleware/cors")
const {
  helmetMiddleware,
  createLimiter,
} = require("./src/core/middleware/security")

require("events").EventEmitter.defaultMaxListeners = 20

const app = express()

// ── Middlewares ────────────────────────────────────────────────────────────────
if (config.server.nodeEnv !== "production") {
  try {
    const morgan = require("morgan")
    app.use(morgan("dev"))
  } catch {
    /* morgan not installed, skip */
  }
}
app.use(corsMiddleware)
app.use(helmetMiddleware)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())

// ── Static Files ───────────────────────────────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "uploads")))
app.use("/images", express.static(path.join(__dirname, "src/public/images")))

// ── Routes ────────────────────────────────────────────────────────────────────
app.use(
  "/api/auth",
  createLimiter({ windowMs: 15 * 60 * 1000, max: 50 }),
  authRoutes
)
app.use("/api/user", userRoutes)
app.use("/api/book", bookRoutes)
app.use("/api/review", reviewRoutes)

// 404
app.use((req, res) =>
  res.status(404).json({ success: false, message: "Not Found" })
)

// Centralized error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  errorLog(err)
  const status = err.status || 500
  const message = err.message || "Internal Server Error"
  return res.status(status).json({ success: false, message })
})

// ── Startup with DB wait/retry ────────────────────────────────────────────────
const PORT = config.server.port || 8080
const HOST = "0.0.0.0"

async function waitForDb(maxRetries = 30, delayMs = 2000) {
  // helpful logs for Docker compose issues
  debug("ENV summary", {
    NODE_ENV: config.server.nodeEnv,
    DB_HOST: config.db.host,
    DB_PORT: config.db.port,
    DB_NAME: config.db.name,
  })

  // try resolve DNS for the DB host (catches ENOTFOUND early)
  try {
    const addr = await dns.lookup(config.db.host)
    debug(`DB DNS: ${config.db.host} -> ${addr.address}`)
  } catch (e) {
    errorLog(`DNS lookup failed for DB host '${config.db.host}':`, e.message)
  }

  for (let i = 1; i <= maxRetries; i++) {
    try {
      await sequelize.authenticate()
      debug("Database connected")
      return
    } catch (err) {
      errorLog(`DB not ready (try ${i}/${maxRetries}):`, err.message)
      await new Promise((r) => setTimeout(r, delayMs))
    }
  }
  throw new Error("Database not reachable after retries")
}

async function start() {
  try {
    await waitForDb()
    // In development, auto-alter to keep schema in sync with model changes
    const alter = config.server.nodeEnv !== "production"
    await sequelize.sync({ alter })
    debug("Database synchronized")

    app.listen(PORT, HOST, () => {
      debug(`Server running on http://${HOST}:${PORT}`)
      debug(`Local:  http://localhost:${PORT}`)
    })
  } catch (err) {
    errorLog("Fatal startup error:", err)
    process.exit(1)
  }
}

start()

// Graceful shutdown
process.on("SIGTERM", () => process.exit(0))
process.on("SIGINT", () => process.exit(0))
