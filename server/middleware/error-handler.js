'use strict';

const UNEXPECTED_ERROR = 'UNEXPECTED_ERROR';

// Catch-all error handler
const errorHandler = function (error, req, res) {
  console.error(error);

  const { stack } = error;
  if (stack) {
    console.error(stack);
  }

  return res
    .status(500)
    .json({ code: UNEXPECTED_ERROR, message: 'An unexpected error occurred on our end.  Please try again later.' });
};

module.exports = errorHandler;
