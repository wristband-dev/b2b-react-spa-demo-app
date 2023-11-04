'use strict';

const retry = require('async-retry');

const { isAccessTokenExpired, setSessionTokenData , bearerToAccessToken} = require('../utils/util');

// Middleware that ensures there is an authenticated user session and JWTs are present.
// Access token is refreshed if expired.
const accessTokenHandler = async function (req, res, next) {

  const accessTokenHeader =  req.headers['authorization'];
  const accessToken = bearerToAccessToken(accessTokenHeader);
  if (!accessToken) {
    return res.status(401).send();
  } else {
    return next();
  }

  //const { accessToken, expiresAt, refreshToken } = req.session;
  // if (!accessToken || !expiresAt || !refreshToken) {
  //   return res.status(401).send();
  // }
  //
  // if (!isAccessTokenExpired(expiresAt)) {
  //   return next();
  // }
  //
  // try {
  //   await retry(
  //     async () => {
  //       /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
  //       const tokenData = apitopiaService.refreshAccessToken(refreshToken);
  //       setSessionTokenData(req, tokenData);
  //     },
  //     { retries: 2, minTimeout: 1000, maxTimeout: 1000 }
  //   );
  //
  //   return next();
  // } catch (error) {
  //   console.error(`Failed to refresh token due to: ${error}`);
  //   return res.status(401).send();
  // }
};

module.exports = accessTokenHandler;
