'use strict';

const { validationResult } = require('express-validator');

const CONSTRAINT_VIOLATIONS_ERROR = 'constraint_violations_error';
const MESSAGE_BODY_CONSTRAINT_VIOLATIONS_ERROR = 'message_body_constraint_violations';
const REQUEST_VALIDATION_FAILED = 'REQUEST_VALIDATION_FAILED';

exports.reqValidation = (req) => {
  const errors = validationResult(req).array();
  if (errors.length > 0) {
    const error = new Error();
    error.data = { code: REQUEST_VALIDATION_FAILED, message: errors };
    throw error;
  }
};

exports.hasConstraintsViolations = (response) => {
  if (!response) {
    return false;
  }

  const { data, status } = response;
  return (
    status === 400 &&
    data &&
    data.type === CONSTRAINT_VIOLATIONS_ERROR &&
    data.code === MESSAGE_BODY_CONSTRAINT_VIOLATIONS_ERROR &&
    data.violations
  );
};

exports.newEmailUnchanged = (response) => {
  return (
    response.violations.newEmail &&
    response.violations.newEmail
      .map((item) => {
        return item.code;
      })
      .includes('email_unchanged')
  );
};

exports.newEmailExists = (response) => {
  return (
    response.violations.newEmail &&
    response.violations.newEmail
      .map((item) => {
        return item.code;
      })
      .includes('not_unique')
  );
};

exports.emailExists = (response) => {
  return (
    response.violations.email &&
    response.violations.email
      .map((item) => {
        return item.code;
      })
      .includes('not_unique')
  );
};

exports.invalidPhoneNumber = (response) => {
  return (
    response.violations.phoneNumber &&
    response.violations.phoneNumber
      .map((item) => {
        return item.code;
      })
      .includes('invalid_e164_phone_number')
  );
};
