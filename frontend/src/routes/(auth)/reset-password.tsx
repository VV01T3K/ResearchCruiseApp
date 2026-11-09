import { getProblemDetail } from '@/api/errors';
import { ResetPasswordRequest } from '@/api/generated/schemas';
import { useAppForm } from '@/integrations/tanstack/form/hook';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { allowOnly } from '@/lib/guards';
import { formValidationLogic } from '@/integrations/tanstack/form/validation';
import { navigateToFirstError } from '@/integrations/tanstack/form/errors';
import { CheckIcon, WarningCircleIcon } from '@phosphor-icons/react';
import React from 'react';
import { Button, ButtonLink } from '@/components/shared/Button';
import { Layout } from '@/components/shared/Layout';
import { Anchor } from '@/components/shared/Link';
import { trackFormSubmit } from '@/integrations/sentry/client';
import { useResetPassword } from '@/api/generated/endpoints/auth.gen';
import { Result } from '@/integrations/auth/types';

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
  const [result, setResult] = React.useState<Result | undefined>(undefined);
  const [errorMessage, setErrorMessage] = React.useState('Link do resetowania hasła jest nieprawidłowy lub wygasł.');
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

      try {
        await mutateAsync({
          data: { emailBase64, resetCode, password: value.password, passwordConfirm: value.passwordConfirm },
        });
        setResult('success');
      } catch (error) {
        setErrorMessage(getProblemDetail(error, 'Operacja nie powiodła się.'));
        setResult('error');
      }
    },
    onSubmitInvalid: ({ formApi }) => {
      trackFormSubmit('reset-password', 'invalid', formApi.state);
      navigateToFirstError();
    },
  });

  if (result || !emailBase64 || !resetCode) {
    const title = result === 'success' ? 'Hasło zostało zmienione' : 'Błąd podczas resetowania hasła';
    return (
      <Layout title={title} variant="narrow">
        <div className="flex flex-col items-center">
          <div className="h-60">
            {result === 'success' ? (
              <CheckIcon className="text-success" />
            ) : (
              <WarningCircleIcon className="text-danger" />
            )}
          </div>
          <div className="text-center text-neutral-600">
            {result === 'success' && <>Hasło zostało pomyślnie zmienione. Możesz teraz się zalogować</>}
            {result !== 'success' && (
              <>
                {errorMessage} W razie problemów napisz na{' '}
                <Anchor href="mailto:rejsy.help@ug.edu.pl">rejsy.help@ug.edu.pl</Anchor>
              </>
            )}
          </div>
        </div>
        <ButtonLink to="/login" className="mt-6 w-full">
          Przejdź do logowania
        </ButtonLink>
      </Layout>
    );
  }

  return (
    <Layout title="Resetowanie hasła" variant="narrow">
      <form
        className="px-4"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <form.AppField name="password">
          {(field) => <field.FloatingTextField type="password" label="Hasło" />}
        </form.AppField>

        <form.AppField name="passwordConfirm">
          {(field) => <field.FloatingTextField type="password" label="Potwierdź hasło" />}
        </form.AppField>

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" className="mt-6 w-full" loading={isSubmitting}>
              Zmień hasło
            </Button>
          )}
        </form.Subscribe>
      </form>
    </Layout>
  );
}
