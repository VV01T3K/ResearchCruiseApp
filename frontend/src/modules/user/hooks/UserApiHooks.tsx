import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

import { client } from '@/core/lib/api';
import { Result } from '@/user/models/Results';

type Props = {
  setResult: (result: Result) => void;
};

export function useConfirmEmailMutation({ setResult }: Props) {
  return useMutation({
    mutationFn: async ({ userId, code }: { userId: string; code: string }) => {
      return await client.get('/account/emailConfirmation', {
        params: {
          userId,
          code,
        },
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

export function useForgotPasswordMutation({ setResult }: Props) {
  return useMutation({
    mutationFn: async (email: string) => {
      return await client.post('/account/forgotPassword', { email });
    },
    onSuccess: () => {
      setResult('success');
    },
    onError: () => {
      setResult('error');
    },
  });
}

export type RegisterDto = {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
};

type RegisterProps = {
  setResult: (result: Result | 'username-taken') => void;
};

export function useRegisterMutation({ setResult }: RegisterProps) {
  return useMutation({
    mutationFn: async (data: RegisterDto) => {
      return await client.post('/account/register', data);
    },
    onSuccess: async () => {
      setResult('success');
    },
    onError: async (error) => {
      if (isAxiosError(error)) {
        if (error.response?.data.includes('taken')) {
          setResult('username-taken');
          return;
        }
      }
      setResult('error');
    },
  });
}

type PasswordResetDto = {
  emailBase64: string;
  resetCode: string;
  password: string;
  passwordConfirm: string;
};

export function useResetPasswordMutation({ setResult }: Props) {
  return useMutation({
    mutationFn: async (data: PasswordResetDto) => {
      return await client.post('/account/passwordReset', data);
    },
    onSuccess: () => {
      setResult('success');
    },
    onError: () => {
      setResult('error');
    },
  });
}

type PasswordChangeDto = {
  password: string;
  newPassword: string;
};

export function useChangePasswordMutation({ setResult }: Props) {
  return useMutation({
    mutationFn: async (data: PasswordChangeDto) => {
      return await client.patch('/account/password', data);
    },
    onSuccess: () => {
      setResult('success');
    },
    onError: () => {
      setResult('error');
    },
  });
}
