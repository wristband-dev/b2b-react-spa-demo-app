'use strict';

const { validationResult } = require('express-validator');

const REQUEST_VALIDATION_FAILED = 'REQUEST_VALIDATION_FAILED';

exports.accessToBearerToken = (accessToken) => {
  if (!accessToken) {
    throw new Error('No access token found in auth header.');
  }
  return { headers: { Authorization: `Bearer ${accessToken}` } };
};

exports.bearerToAccessToken = (authHeader) => {
  const parts = authHeader.split(' ');
  let accessToken = null;

  if (parts.length === 2) {
    const scheme = parts[0];
    const credentials = parts[1];

    if (/^Bearer$/i.test(scheme)) {
      accessToken = credentials;
    }
  }
  return accessToken;
};

exports.addressToTextBlock = (address = {}) => {
  const { street1, street2, city, state, zipCode } = address;
  const streetInfo = street2 ? `${street1}\n${street2}` : street1;
  return `${streetInfo}\n${city}, ${state} ${zipCode}`;
};

exports.hasAccessToApi = (requiredPermissions = [], currentPermissions = []) => {
  if (!requiredPermissions.length || !currentPermissions.length) {
    return false;
  }

  return currentPermissions.every((currentPermission) => {
    return requiredPermissions.includes(currentPermission);
  });
};

exports.reqValidation = (req) => {
  const errors = validationResult(req).array();
  if (errors.length > 0) {
    const error = new Error();
    error.data = { code: REQUEST_VALIDATION_FAILED, message: errors };
    throw error;
  }
};
