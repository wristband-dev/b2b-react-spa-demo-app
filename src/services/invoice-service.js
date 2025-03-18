import { apiClient } from 'client';
import { util } from '../utils';

export const updateInvoice = async function (invoice) {
  const { id, ...updatedInvoice } = invoice;
  const response = await apiClient.put(`/v1/invoices/${id}`, updatedInvoice, util.bearerToken());
  return response.data;
};
