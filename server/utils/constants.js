'use strict';

const { APPLICATION_DOMAIN, CLIENT_ID, CLIENT_SECRET, DOMAIN_FORMAT } = process.env;

exports.IS_LOCALHOST = DOMAIN_FORMAT === 'LOCALHOST';
exports.INVOTASTIC_HOST = this.IS_LOCALHOST ? 'localhost:6001' : 'business.invotastic.com:6001';
const authCallbackTenantDomain = this.IS_LOCALHOST ? '' : '{tenant_domain}.';

exports.APPLICATION_DOMAIN=`${APPLICATION_DOMAIN}`;
exports.APPLICATION_LOGIN_URL = `https://${APPLICATION_DOMAIN}/login`;
exports.AUTH_CALLBACK_URL = `http://${authCallbackTenantDomain}${this.INVOTASTIC_HOST}/api/auth/callback`;
exports.BASIC_AUTH_AXIOS_CONFIG = {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  auth: { username: CLIENT_ID, password: CLIENT_SECRET },
};
exports.CSRF_TOKEN_COOKIE_NAME = 'XSRF-TOKEN';
exports.FORBIDDEN_ACCESS_RESPONSE = { code: 'Access denied.', message: 'Forbidden access.' };
exports.INVALID_PHONE_NUMBER = 'Invalid phone number provided.';
exports.INVALID_REQUEST = 'Invalid request.';
exports.INVOICE_READ_PERM = 'invoice:read';
exports.INVOICE_WRITE_PERM = 'invoice:write';
exports.LOGIN_STATE_COOKIE_PREFIX = 'login:';
exports.NOT_FOUND = 'Not found.';
exports.SESSION_COOKIE_NAME = 'sid';

exports.InvoiceTerms = Object.freeze({
  DUE_ON_RECEIPT: 'DUE_ON_RECEIPT',
  NET_7: 'NET_7',
  NET_15: 'NET_15',
  NET_30: 'NET_30',
});
exports.InvoiceStatus = Object.freeze({ SENT: 'SENT', CANCELLED: 'CANCELLED' });
exports.States = [
  'AL',
  'AK',
  'AZ',
  'AR',
  'CA',
  'CZ',
  'CO',
  'CT',
  'DE',
  'DC',
  'FL',
  'GA',
  'GU',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'MO',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'OH',
  'OK',
  'OR',
  'PA',
  'PR',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VI',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY',
];
