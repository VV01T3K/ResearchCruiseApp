import { getErrorMessage } from '@/api/errors';
import { toast } from '@/components/shared/layout/toast';
import { ResetPasswordRequest } from '@/api/generated/schemas';
import { formContract } from '@/integrations/tanstack/form/schema';
import { useAppForm } from '@/integrations/tanstack/form/hook';
import { createFileRoute, Navigate } from '@tanstack/react-router';
import { z } from 'zod';
import { allowOnly } from '@/lib/guards';
import { formValidationLogic } from '@/integrations/tanstack/form/validation';
import CheckLgIcon from 'bootstrap-icons/icons/check-lg.svg?react';
import XLgIcon from 'bootstrap-icons/icons/x-lg.svg?react';
import React from 'react';
import { AppButton } from '@/components/shared/AppButton';
import { AppLayout } from '@/components/shared/AppLayout';
import { AppLink } from '@/components/shared/AppLink';
import { trackFormSubmit } from '@/integrations/sentry/client';
import { useResetPassword } from '@/api/generated/endpoints/auth.gen';
import { Result } from '@/integrations/auth/types';

export const Route = createFileRoute('/(auth)/reset-password')({
  component: ResetPasswordPage,
  beforeLoad: allowOnly.unauthenticated(),
  validateSearch: z.object({
    emailBase64: z.string().optional(),
    resetCode: z.string().optional(),
  }),
});

const validationSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Hasło powinno mieć co najmniej 8 znaków')
      .regex(
        /\b(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}\b/,
        'Hasło powinno zawierać jedną dużą literę, jedną małą literę oraz cyfrę'
      ),
    passwordConfirm: z.string(),
  })
  .superRefine(({ password, passwordConfirm }, ctx) => {
    if (password !== passwordConfirm) {
      return ctx.addIssue({
        code: 'custom',
        message: 'Hasła nie są takie same',
        path: ['passwordConfirm'],
      });
    }
  })
  .pipe(formContract(ResetPasswordRequest.pick({ password: true, passwordConfirm: true })));

function ResetPasswordPage() {
  const { emailBase64, resetCode } = Route.useSearch();
  const [result, setResult] = React.useState<Result | undefined>(undefined);
  const { mutateAsync } = useResetPassword({
    mutation: {
      onSuccess: () => setResult('success'),
      onError: (error) => {
        setResult('error');
        toast.error(getErrorMessage(error, 'Operacja nie powiod\u0142a si\u0119'));
      },
    },
  });
  const form = useAppForm({
    defaultValues: {
      password: '',
      passwordConfirm: '',
    },
    validationLogic: formValidationLogic,
    validators: {
      onDynamic: validationSchema,
    },
    onSubmit: async ({ value }) => {
      trackFormSubmit('reset-password', 'valid', form.state);

      if (!emailBase64 || !resetCode) {
        throw new Error('Not all fields are filled despite validation');
      }

      await mutateAsync({
        data: ResetPasswordRequest.parse({ emailBase64, resetCode, ...validationSchema.parse(value) }),
      });
    },
    onSubmitInvalid: ({ formApi }) => {
      trackFormSubmit('reset-password', 'invalid', formApi.state);
    },
  });

  if (!emailBase64 || !resetCode) {
    return <Navigate to="/" />;
  }

  if (result) {
    const title = result === 'success' ? 'Hasło zostało zmienione' : 'Błąd podczas resetowania hasła';
    return (
      <AppLayout title={title} variant="narrow">
        <div className="flex flex-col items-center">
          <div className="h-60">
            {result === 'success' ? <CheckLgIcon className="text-success" /> : <XLgIcon className="text-danger" />}
          </div>
          <div className="text-center text-gray-600">
            {result === 'success' && <>Hasło zostało pomyślnie zmienione. Możesz teraz się zalogować</>}
            {result === 'error' && (
              <>
                Wystąpił błąd podczas resetowania hasła. Proszę skontaktować się z pomocą{' '}
                <AppLink href="mailto:rejsy.help@ug.edu.pl">rejsy.help@ug.edu.pl</AppLink>
              </>
            )}
          </div>
        </div>
        <AppButton type="link" href="/login" className="mt-6 w-full">
          Przejdź do logowania
        </AppButton>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Resetowanie hasła" variant="narrow">
      <form
        className="px-4"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit().catch(() => {});
        }}
      >
        <form.AppField
          name="password"
          children={(field) => <field.FloatingTextField type="password" label="Hasło" />}
        />

        <form.AppField
          name="passwordConfirm"
          children={(field) => <field.FloatingTextField type="password" label="Potwierdź hasło" />}
        />

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <AppButton type="submit" className="mt-6 w-full" disabled={!canSubmit || isSubmitting}>
              Zmień hasło
            </AppButton>
          )}
        />
      </form>
    </AppLayout>
  );
}
