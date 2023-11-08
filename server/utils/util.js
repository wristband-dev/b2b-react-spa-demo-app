'use strict';

const crypto = require('crypto');
const moment = require('moment');

const { INVOTASTIC_HOST } = require('./constants');

function base64URLEncode(strToEncode) {
  return strToEncode.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

exports.setNoCacheHeaders = function (res) {
  res.header('Cache-Control', 'no-store');
  res.header('Pragma', 'no-cache');
};

exports.isAccessTokenExpired = function (expiresAtMs) {
  if (!expiresAtMs) {
    return true;
  }

  const currentTime = moment().valueOf();
  return currentTime >= expiresAtMs;
};

exports.createUniqueCryptoStr = function () {
  return base64URLEncode(crypto.randomBytes(32));
};

exports.createCodeChallenge = function (codeVerifier) {
  return base64URLEncode(crypto.createHash('sha256').update(codeVerifier).digest());
};

exports.toQueryString = function (queryParams = {}) {
  const params = new URLSearchParams(queryParams);
  return params.toString();
};

exports.createFormData = (formParams) => {
  if (!formParams) {
    return '';
  }

  return Object.keys(formParams)
    .map((key) => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(formParams[key])}`;
    })
    .join('&');
};

exports.getValueForDeletableField = (value) => {
  if (value === null || value === '') {
    return null;
  }

  return value || undefined;
};

exports.isValidDomainSuffix = (host) => {
  return host.substr(host.indexOf('.') + 1) === INVOTASTIC_HOST;
};

exports.parseTenantDomainName = (host) => {
  return host.substr(0, host.indexOf('.'));
};

exports.accessToBearerToken = ( accessToken ) => {
  if (!accessToken){
    throw new Error('No access token found in auth header.');
  }
  return { headers: { Authorization: `Bearer ${accessToken}` } };
}

exports.bearerToAccessToken = (authHeader) => {
  const parts= authHeader.split(' ');
  let accessToken = null;
  if (parts.length === 2) {
    const scheme = parts[0];
    const credentials = parts[1];

    if (/^Bearer$/i.test(scheme)) {
      accessToken = credentials;
    }
    return accessToken;
  }
};

exports.normalizePhoneNumber = (phoneNumber = '') => {
  const value = phoneNumber.replace(/\s+/g, '').replace('(', '').replace(')', '').replace('-', '');
  return value === '+' ? '' : value;
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
