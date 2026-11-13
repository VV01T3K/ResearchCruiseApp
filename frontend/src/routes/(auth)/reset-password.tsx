import { getProblemDetail } from '@/api/errors';
import { ResetPasswordRequest } from '@/api/generated/schemas';
import { useAppForm } from '@/integrations/tanstack/form/hook';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { allowOnly } from '@/lib/guards';
import { formValidationLogic } from '@/integrations/tanstack/form/validation';
import { navigateToFirstError } from '@/integrations/tanstack/form/errors';
import React from 'react';
import { Alert } from '@/components/shared/Alert';
import { Button } from '@/components/shared/Button';
import { Anchor, Link } from '@/components/shared/Link';
import { trackFormSubmit } from '@/integrations/sentry/client';
import { useResetPassword } from '@/api/generated/endpoints/auth.gen';
import { AuthCard } from '@/features/auth/components/AuthCard';
import { ResultPanel } from '@/features/auth/components/ResultPanel';

export const Route = createFileRoute('/(auth)/reset-password')({
  component: ResetPasswordPage,
  beforeLoad: allowOnly.unauthenticated(),
  validateSearch: z.object({
    emailBase64: z.string().optional().catch(undefined),
    resetCode: z.string().optional().catch(undefined),
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
  .pipe(ResetPasswordRequest.pick({ password: true, passwordConfirm: true }));

function ResetPasswordPage() {
  const { emailBase64, resetCode } = Route.useSearch();
  const [changed, setChanged] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(undefined);
  const { mutateAsync } = useResetPassword({ mutation: { meta: { handlesError: true } } });
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

      setErrorMessage(undefined);
      try {
        await mutateAsync({
          data: { emailBase64, resetCode, password: value.password, passwordConfirm: value.passwordConfirm },
        });
        setChanged(true);
      } catch (error) {
        setErrorMessage(getProblemDetail(error, 'Operacja nie powiodła się.'));
      }
    },
    onSubmitInvalid: ({ formApi }) => {
      trackFormSubmit('reset-password', 'invalid', formApi.state);
      navigateToFirstError();
    },
  });

  if (changed) {
    return (
      <AuthCard title="Resetowanie hasła">
        <ResultPanel variant="success" title="Hasło zostało zmienione" loginLink>
          Możesz teraz zalogować się nowym hasłem.
        </ResultPanel>
      </AuthCard>
    );
  }

  if (!emailBase64 || !resetCode) {
    return (
      <AuthCard title="Resetowanie hasła">
        <ResultPanel variant="danger" title="Błąd podczas resetowania hasła" loginLink>
          Link do resetowania hasła jest nieprawidłowy lub wygasł. W razie problemów napisz na{' '}
          <Anchor href="mailto:rejsy.help@ug.edu.pl">rejsy.help@ug.edu.pl</Anchor>
        </ResultPanel>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Resetowanie hasła" footer={<Link to="/login">Wróć do logowania</Link>}>
      <form
        noValidate
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <form.AppField name="password">{(field) => <field.TextField type="password" label="Hasło" />}</form.AppField>

        <form.AppField name="passwordConfirm">
          {(field) => <field.TextField type="password" label="Potwierdź hasło" />}
        </form.AppField>

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" className="w-full" loading={isSubmitting}>
              Zmień hasło
            </Button>
          )}
        </form.Subscribe>
      </form>
    </AuthCard>
  );
}
