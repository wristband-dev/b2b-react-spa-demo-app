import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

import { sessionService } from '../services';

export const useSessionCompany = () => {
  return useQuery(['session-company'], sessionService.fetchSessionCompany, {
    cacheTime: Infinity,
    staleTime: Infinity,
    placeholderData: { address: {} },
  });
};

export const useSessionRole = () => {
  return useQuery(['session-role'], sessionService.fetchSessionRole, {
    cacheTime: Infinity,
    staleTime: Infinity,
    placeholderData: {},
  });
};

export const useSessionUser = () => {
  return useQuery(['session-user'], sessionService.fetchSessionUser, {
    cacheTime: Infinity,
    staleTime: Infinity,
    placeholderData: {},
  });
};

export const useSessionConfigs = () => {
  return useQuery(['session-configs'], sessionService.fetchSessionConfigs, {
    cacheTime: Infinity,
    placeholderData: { requiredFields: [] },
  });
};

export const useCreateSessionCompany = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation(sessionService.updateSessionCompany, {
    onSuccess: (data) => {
      queryClient.setQueryData(['session-company'], data);
      enqueueSnackbar('Thanks for joining the Invotastic platform.  Cheers!', { variant: 'success' });
    },
    onError: (error) => {
      console.log(error);
      enqueueSnackbar(`${error.response.data.code}`, { variant: 'error' });
    },
  });
};

export const useUpdateSessionCompany = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation(sessionService.updateSessionCompany, {
    onMutate: async (updatedCompany) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['session-company'], exact: true });
      // Snapshot the previous value
      const previousCompany = queryClient.getQueryData(['session-company']);
      // Optimistically update to the new value
      queryClient.setQueryData(['session-company'], { ...previousCompany, ...updatedCompany });
      // Return a context with the previous and new value
      return { previousCompany, updatedCompany };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['session-company'], data);
      enqueueSnackbar('Company updated successfully.', { variant: 'success' });
    },
    onError: (error, updatedCompany, context) => {
      console.log(error);
      queryClient.setQueryData(['session-company'], context.previousCompany);
      enqueueSnackbar(`${error.response.data.code}`, { variant: 'error' });
    },
  });
};

export const useUpdateSessionUser = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation(sessionService.updateSessionUser, {
    onMutate: async (updatedUser) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['session-user'], exact: true });
      // Snapshot the previous value
      const previousUser = queryClient.getQueryData(['session-user']);
      // Optimistically update to the new value
      queryClient.setQueryData(['session-user'], { ...previousUser, ...updatedUser });
      // Return a context with the previous and new value
      return { previousUser, updatedUser };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['session-user'], data);
      enqueueSnackbar('Profile updated successfully.', { variant: 'success' });
    },
    onError: (error, updatedUser, context) => {
      console.log(error);
      queryClient.setQueryData(['session-user'], context.previousUser);
      enqueueSnackbar(`${error.response.data.code}`, { variant: 'error' });
    },
  });
};
