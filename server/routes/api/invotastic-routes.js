'use strict';

const express = require('express');
const { body, param } = require('express-validator');

const { InvoiceStatus, InvoiceTerms } = require('../../utils/constants');
const invotasticController = require('../../controllers/invotastic-controller');

const router = express.Router();

// prettier-ignore
router.post(
  '/invoices',
  [
    body('companyId')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 26 }).withMessage('too-long(26)'),
    body('invoiceNumber')
      .exists().withMessage('null')
      .isInt({ min: 1001, max: 1000000 }).withMessage('invalid-invoice-number'),
    body('customerName')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 100 }).withMessage('too-long(100)'),
    body('customerEmail')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 100 }).withMessage('too-long(100)')
      .normalizeEmail()
      .isEmail().withMessage('invalid-email'),
    body('billingAddress')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 200 }).withMessage('too-long(200)'),
    body('terms')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .custom(value => {return InvoiceTerms[value]}).withMessage('invalid-enum'),
    body('invoiceDate')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 30 }).withMessage('too-long(30)')
      .isISO8601({ strict: true }).withMessage('invalid-date'),
    body('dueDate')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 30 }).withMessage('too-long(30)')
      .isISO8601({ strict: true }).withMessage('invalid-date'),
    body('message')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 500 }).withMessage('too-long(500)'),
    body('totalDue')
      .exists().withMessage('null')
      .isFloat({ min: 0.00, locale: 'en-US' }).withMessage('invalid-float'),
  ],
  invotasticController.createInvoice
);

// prettier-ignore
router.put(
  '/invoices/:invoiceId',
  [
    param('invoiceId')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 26 }).withMessage('too-long(26)'),
    body('status')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .custom(value => {return InvoiceStatus[value]}).withMessage('invalid-enum'),
  ],
  invotasticController.updateInvoice
);

// prettier-ignore
router.get(
  '/companies/:companyId/invoices',
  [
    param('companyId')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 26 }).withMessage('too-long(26)')
  ],
  invotasticController.getInvoicesByCompany
);

module.exports = router;
