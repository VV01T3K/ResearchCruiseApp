import { useMutation } from '@tanstack/react-query';

import { client } from '@/lib/api';
import { Result } from '@/models/user/Results';

import { ChangePasswordRequest, PasswordResetRequest, ResetPasswordRequest } from './contracts';

type Props = {
  setResult: (result: Result) => void;
};

export function useForgotPasswordMutation({ setResult }: Props) {
  return useMutation({
    mutationFn: async (request: PasswordResetRequest) => {
      return await client.post('/v2/account/password-reset-request', request);
    },
    onSuccess: () => {
      setResult('success');
    },
    onError: () => {
      setResult('error');
    },
  });
}

export function useResetPasswordMutation({ setResult }: Props) {
  return useMutation({
    mutationFn: async (request: ResetPasswordRequest) => {
      return await client.post('/v2/account/password-reset', request);
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
