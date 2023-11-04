import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

import { settingsService } from '../services';

export const useAssignableRoleOptions = () => {
  return useQuery(['assignable-role-options'], settingsService.fetchAssignableRoleOptions, { placeholderData: [] });
};

export const useNewUserInvites = () => {
  return useQuery(['new-user-invites'], settingsService.fetchNewUserInvites, {
    placeholderData: { items: [], totalResults: 0 },
  });
};

export const useCreateNewUserInvite = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation(settingsService.createNewUserInvite, {
    onSuccess: () => enqueueSnackbar('The user invite email has been sent.', { variant: 'success' }),
    onError: (error) => {
      console.log(error);
      enqueueSnackbar(`${error.response.data.code}`, { variant: 'error' });
    },
    onSettled: () => queryClient.invalidateQueries('new-user-invites'),
  });
};

export const useCancelNewUserInvite = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation(settingsService.cancelNewUserInvite, {
    onSuccess: () => enqueueSnackbar('Invitation has been cancelled.', { variant: 'success' }),
    onMutate: async () => await queryClient.cancelQueries('new-user-invites'),
    onError: (error) => {
      console.log(error);
      enqueueSnackbar(`${error.response.data.code}`, { variant: 'error' });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['new-user-invites'] }),
  });
};

export const useChangeEmailRequests = () => {
  return useQuery(['change-email-requests'], settingsService.fetchChangeEmailRequests, {
    placeholderData: { items: [], totalResults: 0 },
  });
};

export const useCreateChangeEmailRequest = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation(settingsService.createChangeEmailRequest, {
    onSuccess: () => enqueueSnackbar('Check your inbox for further instructions.', { variant: 'success' }),
    onError: (error) => {
      console.log(error);
      enqueueSnackbar(`${error.response.data.code}`, { variant: 'error' });
    },
    onSettled: () => queryClient.invalidateQueries('change-email-requests'),
  });
};

export const useCancelChangeEmailRequest = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation(settingsService.cancelChangeEmailRequest, {
    onSuccess: () => enqueueSnackbar('Change email request has been cancelled.', { variant: 'success' }),
    onMutate: async () => await queryClient.cancelQueries('change-email-requests'),
    onError: (error) => {
      console.log(error);
      enqueueSnackbar(`${error.response.data.code}`, { variant: 'error' });
    },
    onSettled: () => queryClient.invalidateQueries('change-email-requests'),
  });
};

// This could probably just be a raw axios call from the component logic since password data is
// not part of the session user data.
export const useChangePassword = (clearPasswords) => {
  const { enqueueSnackbar } = useSnackbar();

  return useMutation(settingsService.changePassword, {
    onSuccess: () => {
      clearPasswords();
      enqueueSnackbar('Password changed successfully.', { variant: 'success' });
    },
    onError: (error) => {
      console.log(error);
      enqueueSnackbar(`${error.response.data.message}`, { variant: 'error' });
    },
  });
};

export const useUserCount = () => {
  return useQuery(['user-count'], settingsService.fetchUserCount, { placeholderData: 1 });
};
