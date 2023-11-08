'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const errorHandler = require('./middleware/error-handler');
const routes = require('./routes/index');

const { NODE_ENV } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Defined routes for all API endpoint/non-static assets
app.use('/api', routes);

// Serve static assets if in production mode.
if (NODE_ENV === 'production') {
  console.info('Production ENV detected. Serving up static assets.');
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

// Catch-all for any unexpected server-side errors.
app.use(errorHandler);

module.exports = app;
