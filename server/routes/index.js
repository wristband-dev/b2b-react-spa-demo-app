'use strict';

const express = require('express');

const apiRoutes = require('./api/index');
const accessTokenMiddleware = require('../middleware/access-token-middleware');

const router = express.Router();

/* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
// The middlewares here ensure that an authenticated user's token exists.
router.use('/v1', [accessTokenMiddleware], apiRoutes);

module.exports = router;
