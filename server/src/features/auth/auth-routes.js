const express = require("express");
const router = express.Router();
const passport = require("passport");
const debug = require("debug")("fictionbook:auth");
const authController = require("./auth-controller");
const { authenticate } = require("./auth-middleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.put("/reset-password", authController.resetPassword);
router.delete("/account", authenticate, authController.deleteAccount);

// Google OAuth
router.get("/google", (req, res, next) => {
  const state = req.query.state ? Buffer.from(req.query.state).toString('base64') : undefined;
  // Ask for offline access to receive a refresh_token
  const options = {
    scope: ['openid', 'profile', 'email'],
    accessType: 'offline',
    prompt: 'consent',
    state,
  };

  debug("/auth/google init", {
    stateRaw: req.query.state,
    state,
    scope: options.scope,
    accessType: options.accessType,
    prompt: options.prompt,
  });

  // Capture the redirect URL that Passport generates for debugging
  const originalRedirect = res.redirect.bind(res);
  res.redirect = function (...args) {
    try {
      const url = typeof args[0] === 'string' ? args[0] : args[1];
      debug("Google OAuth redirect URL:", url);
    } catch (e) {
      debug('Failed to log Google redirect URL:', e?.message || e)
    }
    return originalRedirect(...args);
  };

  passport.authenticate('google', options)(req, res, next);
});

router.get("/google/callback", authController.googleCallback);

module.exports = router;
