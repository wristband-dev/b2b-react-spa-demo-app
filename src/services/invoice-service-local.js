// invoiceService.js
// Service layer that provides async methods for invoice operations

import invoiceDB from '../db/wristband-demo-db';

class InvoiceService {
  /**
   * Get all invoices for a specific company
   * @param {string} companyId - The company ID to filter by
   * @returns {Promise<Array>} - Promise resolving to an array of invoice objects
   */
  async getInvoicesForCompany(companyId) {
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const invoices = invoiceDB.getInvoicesByCompany(companyId);
        resolve(invoices);
      }, 100);
    });
  }

  /**
   * Create a new invoice
   * @param {Object} invoiceData - The invoice data to create
   * @returns {Promise<Object>} - Promise resolving to the created invoice
   */
  async createInvoice(invoiceData) {
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const createdInvoice = invoiceDB.createInvoice(invoiceData);
        resolve(createdInvoice);
      }, 200);
    });
  }

  /**
   * Delete an invoice
   * @param {string} invoiceId - The ID of the invoice to delete
   * @returns {Promise<boolean>} - Promise resolving to success/failure
   */
  async deleteInvoice(invoiceId) {
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = invoiceDB.deleteInvoice(invoiceId);
        resolve(result);
      }, 150);
    });
  }
}

const invoiceServiceLocal = new InvoiceService();

export { invoiceServiceLocal };
