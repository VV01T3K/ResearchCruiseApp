import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

import { ProblemDetails } from '@/lib/api';
import {
  CruiseManagerOptionResponse,
  UserCreateRequest,
  UserProfilePatchRequest,
  UserResponse,
  UserWriteRequest,
} from '@/api/users/contracts';
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

      const request: UserCreateRequest = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        roles: [data.role],
      };
      return await client.post('/v2/users', request);
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

      const request: UserProfilePatchRequest = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      };
      return await client.patch(`/v2/users/${userId}`, request);
    },
    onError: (error) => {
      setSubmitError(getProblemDetail(error, 'Wystąpił błąd podczas aktualizacji użytkownika'));
    },
  });
}

export function useAddUserRoleMutation() {
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) =>
      client.put(`/v2/users/${userId}/roles/${role}`),
  });
}

export function useRemoveUserRoleMutation() {
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) =>
      client.delete(`/v2/users/${userId}/roles/${role}`),
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

      return await client.post('/v2/auth/password-reset-request', { email });
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
