import { createFileRoute, Navigate } from '@tanstack/react-router';
import { z } from 'zod';
import { allowOnly } from '@/lib/guards';
import { revalidateLogic, useForm } from '@tanstack/react-form';
import CheckLgIcon from 'bootstrap-icons/icons/check-lg.svg?react';
import XLgIcon from 'bootstrap-icons/icons/x-lg.svg?react';
import React from 'react';
import { AppButton } from '@/components/shared/AppButton';
import { AppLayout } from '@/components/shared/AppLayout';
import { AppLink } from '@/components/shared/AppLink';
import { AppFloatingLabelInput } from '@/components/shared/inputs/AppFloatingLabelInput';
import { trackFormSubmit } from '@/integrations/sentry/client';
import { getErrors } from '@/integrations/tanstack/form/errors';
import { useResetPassword } from '@/api/generated/endpoints/auth.gen';
import { Result } from '@/api/user';

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
  });

function ResetPasswordPage() {
  const { emailBase64, resetCode } = Route.useSearch();
  const [result, setResult] = React.useState<Result | undefined>(undefined);
  const { mutateAsync } = useResetPassword({
    mutation: {
      onSuccess: () => setResult('success'),
      onError: () => setResult('error'),
    },
  });
  const form = useForm({
    defaultValues: {
      password: '',
      passwordConfirm: '',
    },
    validationLogic: revalidateLogic({ mode: 'change', modeAfterSubmission: 'change' }),
    validators: {
      onDynamic: validationSchema,
    },
    onSubmit: async ({ value }) => {
      trackFormSubmit('reset-password', 'valid', form.state);

      if (!emailBase64 || !resetCode) {
        throw new Error('Not all fields are filled despite validation');
      }

      await mutateAsync({
        data: {
          emailBase64,
          resetCode,
          password: value.password,
          passwordConfirm: value.passwordConfirm,
        },
      }).catch(() => {});
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
          form.handleSubmit();
        }}
      >
        <form.Field
          name="password"
          children={(field) => (
            <AppFloatingLabelInput
              name={field.name}
              value={field.state.value}
              type="password"
              onBlur={field.handleBlur}
              onChange={field.handleChange}
              errors={getErrors(field.state.meta, form.state.submissionAttempts)}
              label="Hasło"
            />
          )}
        />

        <form.Field
          name="passwordConfirm"
          children={(field) => (
            <AppFloatingLabelInput
              name={field.name}
              value={field.state.value}
              type="password"
              onBlur={field.handleBlur}
              onChange={field.handleChange}
              errors={getErrors(field.state.meta, form.state.submissionAttempts)}
              label="Potwierdź hasło"
            />
          )}
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
