const axios = require('axios');
const debug = require('debug')('fictionbook:google-service');

async function revokeGoogleToken(token) {
  if (!token) {
    debug('No token provided for revocation.');
    return;
  }

  try {
    const response = await axios.post(
      'https://oauth2.googleapis.com/revoke',
      null,
      {
        params: {
          token: token,
        },
      }
    );
    debug('Google token revocation successful:', response.status);
  } catch (error) {
    debug('Error revoking Google token:', error.message);
    // Log the error but don't re-throw, as account deletion should proceed
  }
}

module.exports = {
  revokeGoogleToken,
};
