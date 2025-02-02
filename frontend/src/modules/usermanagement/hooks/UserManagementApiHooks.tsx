import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

import { client } from '@/core/lib/api';
import { User } from '@/core/models/User';

type Props = {
  editMode: boolean;
  setSubmitError: (error: string) => void;
};

type UserDto = {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
};

export function useNewUserMutation({ editMode, setSubmitError }: Props) {
  return useMutation({
    mutationFn: async (data: UserDto) => {
      if (editMode) {
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

export function useUpdateUserMutation({ editMode, setSubmitError }: Props) {
  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: UserDto }) => {
      if (!editMode) {
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

export function useDeleteUserMutation({ editMode, setSubmitError }: Props) {
  return useMutation({
    mutationFn: async (userId: string) => {
      if (!editMode) {
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

export function useAcceptUserMutation({ editMode, setSubmitError }: Props) {
  return useMutation({
    mutationFn: async (userId: string) => {
      if (!editMode) {
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

export function useUnAcceptUserMutation({ editMode, setSubmitError }: Props) {
  return useMutation({
    mutationFn: async (userId: string) => {
      if (!editMode) {
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

export function useUsersQuery() {
  return useSuspenseQuery({
    queryKey: ['users'],
    queryFn: () => {
      return client.get('/users');
    },
    select: (data) => data.data as User[],
  });
}
