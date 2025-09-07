const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../model-registry');
const tokenService = require('../core/services/token-service');
const debug = require('debug')('fictionbook:passport');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
    accessType: 'offline',
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      debug('Google verify callback', {
        profileId: profile?.id,
        hasRefreshToken: Boolean(refreshToken),
        accessTokenLen: accessToken ? String(accessToken).length : 0,
      });
      let user = await User.findOne({ where: { googleId: profile.id } });

      if (user) {
        // Update tokens for existing user
        user.googleAccessToken = accessToken;
        user.googleRefreshToken = refreshToken || user.googleRefreshToken; // refreshToken is not always sent, only on first consent
        await user.save();
      } else {
        // Create new user
        user = await User.create({
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value,
          // For Google users, do not set a local username
          username: null,
          profileImage: profile.photos[0].value,
          googleAccessToken: accessToken,
          googleRefreshToken: refreshToken,
        });
      }

      const token = tokenService.signUser(user);
      done(null, { user, token });
    } catch (error) {
      debug('Error in Google verify callback:', error?.message);
      done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

