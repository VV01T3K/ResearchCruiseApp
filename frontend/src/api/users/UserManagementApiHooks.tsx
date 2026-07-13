import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ProblemDetails } from '@/api/account/contracts';
import { UserCreateRequest, UserProfilePatchRequest, UserWriteRequest } from '@/api/users/contracts';
import { CruiseManagerOptionResponse, UserResponse } from '@/api/users/contracts';
import {
  acceptUserV2,
  addUserRoleV2,
  createUserV2,
  deactivateUserV2,
  deleteUserV2,
  getGetUsersV2QueryKey,
  removeUserRoleV2,
  requestPasswordResetV2,
  updateUserV2,
  useGetAvailableCruiseManagersV2Suspense,
  useGetUsersV2Suspense,
} from '@/api/generated/endpoints';
import { CreateUserV2Body, RequestPasswordResetV2Body, UpdateUserV2Body } from '@/api/generated/model';
import { ApiError } from '@/api/fetch';
import { validateRequest } from '@/api/validateRequest';

type Props = {
  editMode: boolean;
  setSubmitError: (error: string) => void;
};

function getProblemDetail(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    return (error.data as ProblemDetails)?.detail ?? fallback;
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
      return createUserV2(validateRequest('create-user', CreateUserV2Body, request));
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
      return updateUserV2(userId, validateRequest('update-user', UpdateUserV2Body, request));
    },
    onError: (error) => {
      setSubmitError(getProblemDetail(error, 'Wystąpił błąd podczas aktualizacji użytkownika'));
    },
  });
}

export function useAddUserRoleMutation() {
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => addUserRoleV2(userId, role),
  });
}

export function useRemoveUserRoleMutation() {
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => removeUserRoleV2(userId, role),
  });
}

export function useDeleteUserMutation({ editMode, setSubmitError }: Props) {
  return useMutation({
    mutationFn: async (userId: string) => {
      if (!editMode) {
        throw new Error('This method should be called only for existing users');
      }

      return deleteUserV2(userId);
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

      return acceptUserV2(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetUsersV2QueryKey() });
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

      return deactivateUserV2(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetUsersV2QueryKey() });
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

      return requestPasswordResetV2(validateRequest('request-password-reset', RequestPasswordResetV2Body, { email }));
    },
    onError: (error) => {
      setSubmitError(getProblemDetail(error, 'Wystąpił błąd podczas inicjowania zmiany hasła'));
    },
  });
}

export function useUsersQuery() {
  return useGetUsersV2Suspense<UserResponse[]>({ query: { select: (users) => users as UserResponse[] } });
}

export function useAvailableCruiseManagersQuery() {
  return useGetAvailableCruiseManagersV2Suspense<CruiseManagerOptionResponse[]>({
    query: { select: (managers) => managers as CruiseManagerOptionResponse[] },
  });
}
