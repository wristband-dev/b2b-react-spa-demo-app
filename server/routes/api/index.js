'use strict';

const express = require('express');

const invotasticRoutes = require('./invotastic-routes');

const router = express.Router();

// All APIs for handling Invotastic-specific resource entities
router.use(invotasticRoutes);

module.exports = router;
