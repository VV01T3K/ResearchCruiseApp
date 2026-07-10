import { useMutation } from '@tanstack/react-query';

import { client } from '@/lib/api';
import { Result } from '@/models/user/Results';

import {
  ChangePasswordRequest,
  ConfirmEmailRequest,
  PasswordResetRequest,
  ResendConfirmationEmailRequest,
  ResetPasswordRequest,
} from './contracts';

type Props = {
  setResult: (result: Result) => void;
};

export function useForgotPasswordMutation({ setResult }: Props) {
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

export function useConfirmEmailMutation({ setResult }: Props) {
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

export function useResetPasswordMutation({ setResult }: Props) {
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

export function useChangePasswordMutation({ setResult }: Props) {
  return useMutation({
    mutationFn: async (request: ChangePasswordRequest) => {
      return await client.patch('/v2/account/me/password', request);
    },
    onSuccess: () => {
      setResult('success');
    },
    onError: () => {
      setResult('error');
    },
  });
}
