import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

import { invoiceService } from '../services';

export const useInvoices = (companyId) => {
  return useQuery(['invoices'], () => invoiceService.fetchInvoices(companyId), { placeholderData: [] });
};

export const useInvoice = (invoiceId) => {
  return useQuery(['invoices', invoiceId], () => invoiceService.fetchInvoices(invoiceId), { placeholderData: {} });
};

export const useCreateInvoice = (closeFormDialog) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation(invoiceService.createInvoice, {
    onSuccess: (data) => {
      closeFormDialog();
      queryClient.invalidateQueries('invoices');
      enqueueSnackbar(`Invoice ${data.invoiceNumber} created successfully.`, { variant: 'success' });
    },
    onError: (error) => {
      console.log(error);
      enqueueSnackbar(`${error.response.data.code}`, { variant: 'error' });
    },
  });
};

export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation(invoiceService.updateInvoice, {
    onSuccess: (data) => {
      enqueueSnackbar(`Invoice ${data.invoiceNumber} updated successfully.`, { variant: 'success' });
    },
    onMutate: async () => await queryClient.cancelQueries('invoices'),
    onError: (error) => {
      console.log(error);
      enqueueSnackbar(`${error.response.data.code}`, { variant: 'error' });
    },
    onSettled: () => queryClient.invalidateQueries('invoices'),
  });
};
