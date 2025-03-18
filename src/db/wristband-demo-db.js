// invoiceDBService.js
// A browser-based replacement for your server-side lowdb implementation

import { nanoid } from 'nanoid';

const STORAGE_KEY = 'wristband_demo_db';
const INVOICES_SCHEMA = 'invoices';

class InvoiceDBService {
  constructor() {
    this.initializeDB();
  }

  // Initialize the database in localStorage
  initializeDB() {
    const existingDB = localStorage.getItem(STORAGE_KEY);

    if (!existingDB) {
      const defaultData = { [INVOICES_SCHEMA]: [] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    }
  }

  // Get the entire database
  getDB() {
    const dbData = localStorage.getItem(STORAGE_KEY);
    return dbData ? JSON.parse(dbData) : { [INVOICES_SCHEMA]: [] };
  }

  // Write to the database
  writeDB(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  // Create a new invoice
  createInvoice(newInvoice) {
    const db = this.getDB();
    const invoiceWithId = { id: nanoid(), ...newInvoice };

    db[INVOICES_SCHEMA].push(invoiceWithId);
    this.writeDB(db);

    return invoiceWithId;
  }

  // Delete an invoice
  deleteInvoice(invoiceId) {
    const db = this.getDB();
    const initialLength = db[INVOICES_SCHEMA].length;

    db[INVOICES_SCHEMA] = db[INVOICES_SCHEMA].filter((invoice) => invoice.id !== invoiceId);

    if (db[INVOICES_SCHEMA].length < initialLength) {
      this.writeDB(db);
      return true;
    }

    return false;
  }

  // Get all invoices for a specific company
  getInvoicesByCompany(companyId) {
    const db = this.getDB();
    return db[INVOICES_SCHEMA].filter((invoice) => invoice.companyId === companyId);
  }

  // Clear all data
  clearData() {
    const emptyDB = { [INVOICES_SCHEMA]: [] };
    this.writeDB(emptyDB);
  }
}

export default new InvoiceDBService();
