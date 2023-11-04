'use strict';

// Middleware that "touches" the session cookie to update the max age.
// If a token refresh occurred, the new token data will be saved to the session.
const sessionCookieHandler = async function (req, res, next) {
  await req.session.save();
  return next();
};

module.exports = sessionCookieHandler;
