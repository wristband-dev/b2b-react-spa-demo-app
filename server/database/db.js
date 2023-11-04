'use strict';

const lowDb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { nanoid } = require('nanoid');

const INVOICES_SCHEMA = 'invoices';
const DATABASE_FILE = 'db.json';
const DEFAULT_DATA = { [INVOICES_SCHEMA]: [] };

const db = lowDb(new FileSync(DATABASE_FILE));
db.defaults(DEFAULT_DATA).write();

// //////////////////////////////
//  INVOICES
// //////////////////////////////

exports.getInvoice = function (invoiceId) {
  return db.get(INVOICES_SCHEMA).find({ id: invoiceId }).value();
};

exports.createInvoice = function (newInvoice) {
  const invoiceWithId = { id: nanoid(), ...newInvoice };
  db.get(INVOICES_SCHEMA).push(invoiceWithId).write();
  return invoiceWithId;
};

exports.updateInvoice = function (updatedInvoice) {
  db.get(INVOICES_SCHEMA).find({ id: updatedInvoice.id }).assign(updatedInvoice).write();
  return updatedInvoice;
};

exports.getInvoicesByCompany = function (companyId) {
  return db.get(INVOICES_SCHEMA).filter({ companyId }).value();
};
