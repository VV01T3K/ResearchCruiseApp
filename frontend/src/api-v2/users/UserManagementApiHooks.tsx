import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

import { ProblemDetails } from '@/api-v2/account/contracts';
import { CruiseManagerOptionResponse, UserResponse, UserWriteRequest } from '@/api-v2/users/contracts';
import { client } from '@/lib/api';

type Props = {
  editMode: boolean;
  setSubmitError: (error: string) => void;
};

function getProblemDetail(error: unknown, fallback: string) {
  if (isAxiosError<ProblemDetails>(error)) {
    return error.response?.data.detail ?? fallback;
  }

  return fallback;
}

export function useNewUserMutation({ editMode, setSubmitError }: Props) {
  return useMutation({
    mutationFn: async (data: UserWriteRequest) => {
      if (editMode) {
        throw new Error('This method should be called only for new users');
      }

      return await client.post('/v2/users', data);
    },
    onError: (error) => {
      setSubmitError(getProblemDetail(error, 'Wystąpił błąd podczas dodawania użytkownika'));
    },
  });
}

export function useUpdateUserMutation({ editMode, setSubmitError }: Props) {
  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: UserWriteRequest }) => {
      if (!editMode) {
        throw new Error('This method should be called only for existing users');
      }

      return await client.put(`/v2/users/${userId}`, data);
    },
    onError: (error) => {
      setSubmitError(getProblemDetail(error, 'Wystąpił błąd podczas aktualizacji użytkownika'));
    },
  });
}

export function useDeleteUserMutation({ editMode, setSubmitError }: Props) {
  return useMutation({
    mutationFn: async (userId: string) => {
      if (!editMode) {
        throw new Error('This method should be called only for existing users');
      }

      return await client.delete(`/v2/users/${userId}`);
    },
    onError: (error) => {
      setSubmitError(getProblemDetail(error, 'Wystąpił błąd podczas usuwania użytkownika'));
    },
  });
}

export function useAcceptUserMutation({ editMode, setSubmitError }: Props) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      if (!editMode) {
        throw new Error('This method should be called only for existing users');
      }

      return await client.put(`/v2/users/${userId}/acceptance`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      setSubmitError(getProblemDetail(error, 'Wystąpił błąd podczas akceptacji użytkownika'));
    },
  });
}

export function useUnAcceptUserMutation({ editMode, setSubmitError }: Props) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      if (!editMode) {
        throw new Error('This method should be called only for existing users');
      }

      return await client.delete(`/v2/users/${userId}/acceptance`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      setSubmitError(getProblemDetail(error, 'Wystąpił błąd podczas cofania akceptacji użytkownika'));
    },
  });
}

export function useInitiatePasswordResetMutation({ editMode, setSubmitError }: Props) {
  return useMutation({
    mutationFn: async (email: string) => {
      if (!editMode) {
        throw new Error('This method should be called only for existing users');
      }

      return await client.post('/v2/account/password-reset-request', { email });
    },
    onError: (error) => {
      setSubmitError(getProblemDetail(error, 'Wystąpił błąd podczas inicjowania zmiany hasła'));
    },
  });
}

export function useUsersQuery() {
  return useSuspenseQuery({
    queryKey: ['users'],
    queryFn: async () => client.get<UserResponse[]>('/v2/users'),
    select: (response) => response.data,
  });
}

export function useAvailableCruiseManagersQuery() {
  return useSuspenseQuery({
    queryKey: ['availableCruiseManagers'],
    queryFn: async () => client.get<CruiseManagerOptionResponse[]>('/v2/users/available-cruise-managers'),
    select: (response) => response.data,
  });
}
