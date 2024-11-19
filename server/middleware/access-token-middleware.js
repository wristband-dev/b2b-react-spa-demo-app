'use strict';

const { bearerToAccessToken } = require('../utils/util');

// Middleware that ensures that an authenticated user's token exists.
const accessTokenMiddleware = async function (req, res, next) {
  const accessToken = bearerToAccessToken(req.headers.authorization);
  if (!accessToken) {
    return res.status(401).send();
  }

  return next();
};

module.exports = accessTokenMiddleware;
