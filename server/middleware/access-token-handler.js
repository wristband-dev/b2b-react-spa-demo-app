'use strict';

const { isAccessTokenExpired, bearerToAccessToken} = require('../utils/util');

// Middleware that ensures there is an authenticated user session and JWTs are present.
// Access token is refreshed if expired.
const accessTokenHandler = async function (req, res, next) {

  const accessTokenHeader =  req.headers['authorization'];
  const accessToken = bearerToAccessToken(accessTokenHeader);
  if (!accessToken) {
    return res.status(401).send();
  } 

  return next();
};

module.exports = accessTokenHandler;
