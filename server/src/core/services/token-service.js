const jwt = require("jsonwebtoken");
const config = require("../../config");

function signUser(user, options = {}) {
  const payload = { id: user.id, username: user.username, email: user.email };
  const expiresIn = options.expiresIn || config.auth.jwtExpiresIn;
  return jwt.sign(payload, config.auth.jwtSecret, { expiresIn });
}

module.exports = { signUser };
