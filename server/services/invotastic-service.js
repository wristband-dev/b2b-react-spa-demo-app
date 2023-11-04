'use strict';

// NOTE: The local file DB library being used is synchronous.  To mimic a more realistic scenario where
// database access functions are asynchronous, all service functions are wrapped in promises.
// TODO: Upgrading to LowDB version 3 (asynchronous) requires switching to ES modules for the whole project...
const db = require('../database/db');

exports.getInvoice = async function (invoiceId) {
  const invoice = await Promise.resolve(db.getInvoice(invoiceId));
  return invoice;
};

exports.getInvoicesForCompany = async function (companyId) {
  const invoices = await Promise.resolve(db.getInvoicesByCompany(companyId));
  return invoices;
};

exports.createInvoice = async function (invoiceData) {
  const createdInvoice = await Promise.resolve(db.createInvoice(invoiceData));
  return createdInvoice;
};

exports.updateInvoice = async function (invoiceData) {
  const updatedInvoice = await Promise.resolve(db.updateInvoice(invoiceData));
  return updatedInvoice;
};
