import { useMutation } from '@tanstack/react-query';
import axios, { isAxiosError } from 'axios';

import { client, ProblemDetails } from '@/lib/api';
import { AuthDetails } from '@/models/user/AuthDetails';
import { Result } from '@/models/user/Results';

import {
  AuthResponse,
  ConfirmEmailRequest,
  LoginRequest,
  PasswordResetRequest,
  RefreshRequest,
  RegisterRequest,
  ResendConfirmationEmailRequest,
  ResetPasswordRequest,
} from './contracts';

type MutationProps = {
  updateAuthDetails: (newAuthDetails: AuthDetails | undefined) => Promise<void>;
};

type RegisterProps = {
  setResult: (result: Result | 'username-taken') => void;
};

type ResultProps = {
  setResult: (result: Result) => void;
};

export function useLoginMutation({ updateAuthDetails }: MutationProps) {
  return useMutation({
    mutationFn: (request: LoginRequest) => {
      return client.post<AuthResponse>('/v2/auth/login', request);
    },
    onSuccess: async ({ data }) => {
      const authDetails: AuthDetails = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        accessTokenExpirationDate: new Date(data.accessTokenExpirationDate),
        refreshTokenExpirationDate: new Date(data.refreshTokenExpirationDate),
      };
      updateAuthDetails(authDetails);
    },
    onError: () => {
      updateAuthDetails(undefined);
    },
  });
}

export function useRefreshTokenMutation({ updateAuthDetails }: MutationProps) {
  return useMutation({
    mutationFn: ({ accessToken, refreshToken }: RefreshRequest) => {
      // We create a new client here since the main one is paused while refreshing.
      // Don't copy client.defaults to avoid sending an expired Authorization header.
      const refreshClient = axios.create({
        baseURL: client.defaults.baseURL,
      });
      return refreshClient.post<AuthResponse>('/v2/auth/refresh', {
        accessToken,
        refreshToken,
      });
    },
    onSuccess: async ({ data }) => {
      const authDetails: AuthDetails = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        accessTokenExpirationDate: new Date(data.accessTokenExpirationDate),
        refreshTokenExpirationDate: new Date(data.refreshTokenExpirationDate),
      };
      updateAuthDetails(authDetails);
    },
    onError: () => {
      updateAuthDetails(undefined);
    },
  });
}

export function useRegisterMutation({ setResult }: RegisterProps) {
  return useMutation({
    mutationFn: async (request: RegisterRequest) => {
      return await client.post('/v2/auth/register', request);
    },
    onSuccess: async () => {
      setResult('success');
    },
    onError: async (error) => {
      if (isAxiosError<ProblemDetails>(error) && error.response?.data.detail?.includes('taken')) {
        setResult('username-taken');
        return;
      }

      setResult('error');
    },
  });
}

export function useConfirmEmailMutation({ setResult }: ResultProps) {
  return useMutation({
    mutationFn: async (request: ConfirmEmailRequest) => {
      return await client.get('/v2/auth/confirm-email', {
        params: request,
      });
    },
    onSuccess: () => {
      setResult('success');
    },
    onError: () => {
      setResult('error');
    },
  });
}

export function useResendConfirmationEmailMutation() {
  return useMutation({
    mutationFn: async (request: ResendConfirmationEmailRequest) => {
      return await client.post('/v2/auth/resend-confirmation-email', request);
    },
  });
}

export function useForgotPasswordMutation({ setResult }: ResultProps) {
  return useMutation({
    mutationFn: async (request: PasswordResetRequest) => {
      return await client.post('/v2/auth/password-reset-request', request);
    },
    onSuccess: () => {
      setResult('success');
    },
    onError: () => {
      setResult('error');
    },
  });
}

export function useResetPasswordMutation({ setResult }: ResultProps) {
  return useMutation({
    mutationFn: async (request: ResetPasswordRequest) => {
      return await client.post('/v2/auth/password-reset', request);
    },
    onSuccess: () => {
      setResult('success');
    },
    onError: () => {
      setResult('error');
    },
  });
}
