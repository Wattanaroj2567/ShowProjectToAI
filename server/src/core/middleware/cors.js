const cors = require("cors");
const config = require("../../config");

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (config.cors.allowedOrigins.length === 0) return callback(null, true);
    if (config.cors.allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  maxAge: 86400,
};

module.exports = cors(corsOptions);
