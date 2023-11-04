'use strict';

const Tokens = require('csrf');
const crypto = require('crypto');
const moment = require('moment');

const {
  CSRF_TOKEN_COOKIE_NAME,
  INVOTASTIC_HOST,
  LOGIN_STATE_COOKIE_PREFIX,
  SESSION_COOKIE_NAME,
} = require('./constants');

const csrfTokens = new Tokens();

function calculateExpTimeWithBuffer(numOfSeconds) {
  // 5 minute safety buffer included for expiration checks
  return moment()
    .add(numOfSeconds - 300, 'seconds')
    .valueOf();
}

function base64URLEncode(strToEncode) {
  return strToEncode.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

exports.setSessionTokenData = function (req, tokenData) {
  req.session.accessToken = tokenData.access_token;
  req.session.expiresAt = calculateExpTimeWithBuffer(tokenData.expires_in);
  req.session.refreshToken = tokenData.refresh_token;
};

exports.initSessionData = function (req, tokenData, userinfo, tenantDomainName) {
  // Set token data
  req.session.accessToken = tokenData.access_token;
  req.session.expiresAt = calculateExpTimeWithBuffer(tokenData.expires_in);
  req.session.refreshToken = tokenData.refresh_token;

  // Set user info
  req.session.userId = userinfo.sub;
  req.session.tenantId = userinfo.tnt_id;
  req.session.identityProviderName = userinfo.idp_name;
  req.session.tenantDomainName = tenantDomainName;

  // Set CSRF secret
  req.session.csrfSecret = csrfTokens.secretSync();
};

exports.isCsrfTokenValid = function (req) {
  return csrfTokens.verify(req.session.csrfSecret, req.headers['x-xsrf-token']);
};

exports.updateCsrfTokenAndCookie = function (req, res) {
  const csrfToken = csrfTokens.create(req.session.csrfSecret);
  res.cookie(CSRF_TOKEN_COOKIE_NAME, csrfToken, {
    httpOnly: false,
    maxAge: moment.duration(1800000).asMilliseconds(),
    path: '/',
    sameSite: true,
    secure: false,
  });
};

exports.updateLoginStateCookie = function (req, res, state, cookieData) {
  // The max amount of concurrent login state cookies we allow is 3.  If there are already 3 cookies,
  // then we clear the one with the oldest creation timestamp to make room for the new one.
  const allLoginCookieNames = Object.keys(req.cookies).filter((cookieName) => {
    return cookieName.startsWith(`${LOGIN_STATE_COOKIE_PREFIX}`);
  });

  // Retain only the 2 cookies with the most recent timestamps.
  if (allLoginCookieNames.length >= 3) {
    const mostRecentTimestamps = allLoginCookieNames
      .map((cookieName) => {
        return cookieName.split(':')[2];
      })
      .sort((a, b) => {
        return b - a;
      })
      .slice(0, 2);

    allLoginCookieNames.forEach((cookieName) => {
      const timestamp = cookieName.split(':')[2];
      if (!mostRecentTimestamps.includes(timestamp)) {
        res.clearCookie(cookieName);
      }
    });
  }

  // Now add the new login state cookie.
  res.cookie(`${LOGIN_STATE_COOKIE_PREFIX}${state}:${Date.now()}`, cookieData, {
    httpOnly: true,
    maxAge: moment.duration(3600000).asMilliseconds(),
    path: '/',
    sameSite: 'lax',
    secure: false,
  });
};

exports.getAndClearLoginStateCookie = function (req, res, state) {
  // This should always resolve to a single cookie with this prefix, or possibly no cookie at all
  // if it got cleared or expired before the callback was triggered.
  const matchingLoginCookieNames = Object.keys(req.cookies).filter((cookieName) => {
    return cookieName.startsWith(`${LOGIN_STATE_COOKIE_PREFIX}${state}:`);
  });

  let loginStateCookie = '';

  if (matchingLoginCookieNames.length > 0) {
    const cookieName = matchingLoginCookieNames[0];
    loginStateCookie = req.cookies[cookieName];
    res.clearCookie(cookieName);
  }

  return loginStateCookie;
};

exports.setNoCacheHeaders = function (res) {
  res.header('Cache-Control', 'no-store');
  res.header('Pragma', 'no-cache');
};

exports.clearSessionCookies = function (res) {
  res.clearCookie(SESSION_COOKIE_NAME);
  res.clearCookie(CSRF_TOKEN_COOKIE_NAME);
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

exports.bearerToken = (req) => {
  if (!req || !req.session || !req.session.accessToken) {
    throw new Error('No access token found in session for auth header.');
  }

  return { headers: { Authorization: `Bearer ${req.session.accessToken}` } };
};

exports.accessToBearerToken = ( accessToken ) => {
  if(!accessToken){
    throw new Error('No access token found in session for auth header.');
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
