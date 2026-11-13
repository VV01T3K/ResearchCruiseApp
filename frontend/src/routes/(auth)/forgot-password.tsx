import { getErrorMessage } from '@/api/errors';
import { Alert } from '@/components/shared/Alert';
import { RequestPasswordResetRequest } from '@/api/generated/schemas';
import { useAppForm } from '@/integrations/tanstack/form/hook';
import { createFileRoute } from '@tanstack/react-router';
import { allowOnly } from '@/lib/guards';
import { formValidationLogic } from '@/integrations/tanstack/form/validation';
import React from 'react';
import { z } from 'zod';
import { Button } from '@/components/shared/Button';
import { Link } from '@/components/shared/Link';
import { trackFormSubmit } from '@/integrations/sentry/client';
import { navigateToFirstError } from '@/integrations/tanstack/form/errors';
import { useRequestPasswordReset } from '@/api/generated/endpoints/auth.gen';
import { AuthCard } from '@/features/auth/components/AuthCard';
import { ResultPanel } from '@/features/auth/components/ResultPanel';

export const Route = createFileRoute('/(auth)/forgot-password')({
  component: ForgotPasswordPage,
  beforeLoad: allowOnly.unauthenticated(),
});

const validationSchema = z
  .object({
    email: z.email('Niepoprawny adres e-mail'),
  })
  .pipe(RequestPasswordResetRequest);

function ForgotPasswordPage() {
  const [email, setEmail] = React.useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(undefined);
  const { mutateAsync } = useRequestPasswordReset({ mutation: { meta: { handlesError: true } } });
  const form = useAppForm({
    defaultValues: {
      email: '',
    },
    validationLogic: formValidationLogic,
    validators: {
      onDynamic: validationSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      trackFormSubmit('forgot-password', 'valid', formApi.state);

      setErrorMessage(undefined);
      try {
        await mutateAsync({ data: { email: value.email } });
        setEmail(value.email);
      } catch (error) {
        setErrorMessage(getErrorMessage(error, 'Operacja nie powiodła się'));
      }
    },
    onSubmitInvalid: ({ formApi }) => {
      trackFormSubmit('forgot-password', 'invalid', formApi.state);
      navigateToFirstError();
    },
  });

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    void form.handleSubmit();
  }

  if (email) {
    return (
      <AuthCard title="Przywracanie hasła">
        <ResultPanel variant="success" title="Sprawdź skrzynkę e-mail" loginLink>
          Link do resetowania hasła został wysłany na adres:{' '}
          <span className="font-semibold text-foreground">{email}</span>
        </ResultPanel>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Przywracanie hasła" footer={<Link to="/login">Wróć do logowania</Link>}>
      <form noValidate className="space-y-4" onSubmit={handleSubmit}>
        <form.AppField name="email">{(field) => <field.TextField type="email" label="E-mail" />}</form.AppField>

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" className="w-full" loading={isSubmitting}>
              Przypomnij hasło
            </Button>
          )}
        </form.Subscribe>
      </form>
    </AuthCard>
  );
}
