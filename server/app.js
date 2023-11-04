'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');
const { ironSession } = require('iron-session/express');
const moment = require('moment');
const path = require('path');

const errorHandler = require('./middleware/error-handler');
const routes = require('./routes/index');
const { SESSION_COOKIE_NAME } = require('./utils/constants');

const { NODE_ENV, SESSION_COOKIE_SECRET } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 30 minute session duration
const session = ironSession({
  cookieName: SESSION_COOKIE_NAME,
  password: SESSION_COOKIE_SECRET,
  cookieOptions: {
    httpOnly: true,
    // NOTE: Have to add 60s to counter Iron-session's max age logic.
    maxAge: moment.duration(1800, 'seconds').asSeconds() + 60,
    path: '/',
    sameSite: true,
    secure: false,
  },
});

// Defined routes for all API endpoint/non-static assets
app.use('/api', session, routes);

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
