import { AppPage } from '@core/components';
import { AppButton } from '@core/components/AppButton';
import { AppFloatingLabelInput } from '@core/components/AppFloatingLabelInput';
import { allowOnly, client } from '@core/helpers';
import { Result } from '@core/models';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, Navigate } from '@tanstack/react-router';
import React from 'react';
import { z } from 'zod';
import CheckLgIcon from 'bootstrap-icons/icons/check-lg.svg?react';
import XLgIcon from 'bootstrap-icons/icons/x-lg.svg?react';
import { AppLink } from '@core/components/AppLink';

export const Route = createFileRoute('/resetpassword')({
  component: PasswordReset,
  beforeLoad: allowOnly.unauthenticated,
  validateSearch: z.object({
    emailBase64: z.string().optional(),
    resetCode: z.string().optional(),
  }),
});

type PasswordResetDto = {
  emailBase64: string;
  resetCode: string;
  password: string;
  passwordConfirm: string;
};

const passwordResetSchema = z
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

function PasswordReset() {
  const { emailBase64, resetCode } = Route.useSearch();
  const [result, setResult] = React.useState<Result | undefined>(undefined);

  const form = useForm({
    defaultValues: {
      password: '',
      passwordConfirm: '',
    },
    validators: {
      onChange: passwordResetSchema,
    },
    onSubmit: async ({ value }) => {
      if (!emailBase64 || !resetCode) {
        throw new Error('Not all fields are filled despite validation');
      }

      await resetPasswordMutation.mutateAsync({
        emailBase64,
        resetCode,
        password: value.password,
        passwordConfirm: value.passwordConfirm,
      });
    },
  });

  const resetPasswordMutation = useMutation({
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

  if (!emailBase64 || !resetCode) {
    return <Navigate to="/" />;
  }

  if (result) {
    const title = result === 'success' ? 'Hasło zostało zmienione' : 'Błąd podczas resetowania hasła';
    return (
      <AppPage title={title} variant="narrow">
        <div className="flex flex-col items-center">
          <div className="h-60">
            {result === 'success' ? <CheckLgIcon className="text-success" /> : <XLgIcon className="text-danger" />}
          </div>
          <div className="text-gray-600 text-center">
            {result === 'success' && <>Hasło zostało pomyślnie zmienione. Możesz teraz się zalogować</>}
            {result === 'error' && (
              <>
                Wystąpił błąd podczas resetowania hasła. Proszę skontaktować się z pomocą{' '}
                <AppLink to="mailto:help@rejsy.ug.edu.pl">help@rejsy.ug.edu.pl</AppLink>
              </>
            )}
          </div>
        </div>
        <AppButton link to="/login" className="w-full mt-6">
          Przejdź do logowania
        </AppButton>
      </AppPage>
    );
  }

  return (
    <AppPage title="Resetowanie hasła" variant="narrow">
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
              onChange={(e) => field.handleChange(e.target.value)}
              error={field.state.meta.errors.join(', ')}
              label="Hasło"
              required
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
              onChange={(e) => field.handleChange(e.target.value)}
              error={field.state.meta.errors.join(', ')}
              label="Potwierdź hasło"
              required
            />
          )}
        />

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <AppButton type="submit" className="w-full mt-6" disabled={!canSubmit || isSubmitting}>
              Zmień hasło
            </AppButton>
          )}
        />
      </form>
    </AppPage>
  );
}
