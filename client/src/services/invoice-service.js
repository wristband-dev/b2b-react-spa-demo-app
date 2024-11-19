import { apiClient } from 'client';
import { util } from '../utils';

export const fetchInvoices = async function (companyId) {
  const response = await apiClient.get(`/v1/companies/${companyId}/invoices`, util.bearerToken());
  return response.data;
};

export const createInvoice = async function (invoice) {
  const response = await apiClient.post(`/v1/invoices`, invoice, util.bearerToken());
  return response.data;
};

export const updateInvoice = async function (invoice) {
  const { id, ...updatedInvoice } = invoice;
  const response = await apiClient.put(`/v1/invoices/${id}`, updatedInvoice, util.bearerToken());
  return response.data;
};
