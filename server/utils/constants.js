'use strict';

exports.FORBIDDEN_ACCESS_RESPONSE = { code: 'Access denied.', message: 'Forbidden access.' };
exports.INVALID_REQUEST = 'Invalid request.';
exports.INVOICE_READ_PERM = 'invoice:read';
exports.INVOICE_WRITE_PERM = 'invoice:write';
exports.NOT_FOUND = 'Not found.';

exports.InvoiceTerms = Object.freeze({
  DUE_ON_RECEIPT: 'DUE_ON_RECEIPT',
  NET_7: 'NET_7',
  NET_15: 'NET_15',
  NET_30: 'NET_30',
});
exports.InvoiceStatus = Object.freeze({ SENT: 'SENT', CANCELLED: 'CANCELLED' });
