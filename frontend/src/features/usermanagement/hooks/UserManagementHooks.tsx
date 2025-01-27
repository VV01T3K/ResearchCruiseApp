import { client } from '@core/helpers';
import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

import { UserDto } from '../helpers';

type Props = {
  isEditingExistingUser: boolean;
  setSubmitError: (error: string) => void;
};

export function useNewUserMutation({ isEditingExistingUser, setSubmitError }: Props) {
  return useMutation({
    mutationFn: async (data: UserDto) => {
      if (isEditingExistingUser) {
        throw new Error('This method should be called only for new users');
      }
      return await client.post('/users', data);
    },
    onError: async (error) => {
      if (isAxiosError(error)) {
        setSubmitError(error.response?.data);
      } else {
        setSubmitError('Wystąpił błąd podczas dodawania użytkownika');
      }
    },
  });
}

export function useUpdateUserMutation({ isEditingExistingUser, setSubmitError }: Props) {
  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: UserDto }) => {
      if (!isEditingExistingUser) {
        throw new Error('This method should be called only for existing users');
      }
      return await client.put(`/users/${userId}`, data);
    },
    onError: async (error) => {
      if (isAxiosError(error)) {
        setSubmitError(error.response?.data);
      } else {
        setSubmitError('Wystąpił błąd podczas aktualizacji użytkownika');
      }
    },
  });
}

export function useDeleteUserMutation({ isEditingExistingUser, setSubmitError }: Props) {
  return useMutation({
    mutationFn: async (userId: string) => {
      if (!isEditingExistingUser) {
        throw new Error('This method should be called only for existing users');
      }
      return await client.delete(`/users/${userId}`);
    },
    onError: async (error) => {
      if (isAxiosError(error)) {
        setSubmitError(error.response?.data);
      } else {
        setSubmitError('Wystąpił błąd podczas usuwania użytkownika');
      }
    },
  });
}

export function useAcceptUserMutation({ isEditingExistingUser, setSubmitError }: Props) {
  return useMutation({
    mutationFn: async (userId: string) => {
      if (!isEditingExistingUser) {
        throw new Error('This method should be called only for existing users');
      }
      return await client.patch(`/users/unaccepted/${userId}`);
    },
    onError: async (error) => {
      if (isAxiosError(error)) {
        setSubmitError(error.response?.data);
      } else {
        setSubmitError('Wystąpił błąd podczas akceptacji użytkownika');
      }
    },
  });
}

export function useUnAcceptUserMutation({ isEditingExistingUser, setSubmitError }: Props) {
  return useMutation({
    mutationFn: async (userId: string) => {
      if (!isEditingExistingUser) {
        throw new Error('This method should be called only for existing users');
      }
      return await client.patch(`/users/${userId}/deactivate`);
    },
    onError: async (error) => {
      if (isAxiosError(error)) {
        setSubmitError(error.response?.data);
      } else {
        setSubmitError('Wystąpił błąd podczas cofania akceptacji użytkownika');
      }
    },
  });
}
