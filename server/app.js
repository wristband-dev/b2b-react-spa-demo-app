'use strict';

const express = require('express');
const path = require('path');

const errorHandlerMiddleware = require('./middleware/error-handler-middleware');
const routes = require('./routes/index');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Defined routes for all API endpoint/non-static assets
app.use('/api', routes);

// Serve static assets if in production mode.
if (process.env.NODE_ENV === 'production') {
  console.info('Production ENV detected. Serving up static assets.');
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

// Catch-all for any unexpected server-side errors.
app.use(errorHandlerMiddleware);

module.exports = app;
