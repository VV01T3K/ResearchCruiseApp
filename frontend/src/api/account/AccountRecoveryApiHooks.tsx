import { useMutation } from '@tanstack/react-query';

import {
  changeCurrentUserPasswordV2,
  confirmEmailV2,
  requestPasswordResetV2,
  resendConfirmationEmailV2,
  resetPasswordV2,
} from '@/api/generated/endpoints';
import {
  ChangeCurrentUserPasswordV2Body,
  RequestPasswordResetV2Body,
  ResendConfirmationEmailV2Body,
  ResetPasswordV2Body,
} from '@/api/generated/model';
import { validateRequest } from '@/api/validateRequest';
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
      return requestPasswordResetV2(validateRequest('request-password-reset', RequestPasswordResetV2Body, request));
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
      return confirmEmailV2(request);
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
      return resendConfirmationEmailV2(
        validateRequest('resend-confirmation-email', ResendConfirmationEmailV2Body, request)
      );
    },
  });
}

export function useResetPasswordMutation({ setResult }: Props) {
  return useMutation({
    mutationFn: async (request: ResetPasswordRequest) => {
      return resetPasswordV2(validateRequest('reset-password', ResetPasswordV2Body, request));
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
      return changeCurrentUserPasswordV2(validateRequest('change-password', ChangeCurrentUserPasswordV2Body, request));
    },
    onSuccess: () => {
      setResult('success');
    },
    onError: () => {
      setResult('error');
    },
  });
}
