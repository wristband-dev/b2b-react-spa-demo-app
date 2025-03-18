import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

import { invoiceServiceLocal } from '../services';

export const useInvoices = (companyId) => {
  return useQuery(['invoices'], () => invoiceServiceLocal.getInvoicesForCompany(companyId), { placeholderData: [] });
};

export const useCreateInvoice = (closeFormDialog) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation(invoiceServiceLocal.createInvoice, {
    onSuccess: () => {
      closeFormDialog();
      queryClient.invalidateQueries('invoices');
      enqueueSnackbar(`Invoice created successfully.`, { variant: 'success' });
    },
    onError: (error) => {
      console.log(error);
      enqueueSnackbar(`${error.response.data.code}`, { variant: 'error' });
    },
  });
};

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation(invoiceServiceLocal.deleteInvoice, {
    onSuccess: () => {
      enqueueSnackbar(`Invoice deleted successfully.`, { variant: 'success' });
    },
    onMutate: async () => await queryClient.cancelQueries('invoices'),
    onError: (error) => {
      console.log(error);
      enqueueSnackbar(`${error.response.data.code}`, { variant: 'error' });
    },
    onSettled: () => queryClient.invalidateQueries('invoices'),
  });
};
