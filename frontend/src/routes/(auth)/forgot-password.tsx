import { getErrorMessage } from '@/api/errors';
import { toast } from '@/components/shared/layout/toast';
import { RequestPasswordResetRequest } from '@/api/generated/schemas';
import { useAppForm } from '@/integrations/tanstack/form/hook';
import { createFileRoute } from '@tanstack/react-router';
import { allowOnly } from '@/lib/guards';
import { formValidationLogic } from '@/integrations/tanstack/form/validation';
import React from 'react';
import { z } from 'zod';
import { Button, ButtonLink } from '@/components/shared/Button';
import { Layout } from '@/components/shared/Layout';
import { Link } from '@/components/shared/Link';
import { trackFormSubmit } from '@/integrations/sentry/client';
import { navigateToFirstError } from '@/integrations/tanstack/form/errors';
import { useRequestPasswordReset } from '@/api/generated/endpoints/auth.gen';
import { Result } from '@/integrations/auth/types';

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
  const [result, setResult] = React.useState<Result | undefined>(undefined);
  const [email, setEmail] = React.useState<string | undefined>(undefined);
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

      setResult(undefined);
      try {
        await mutateAsync({ data: { email: value.email } });
        setEmail(value.email);
        setResult('success');
      } catch (error) {
        setResult('error');
        toast.error(getErrorMessage(error, 'Operacja nie powiodła się'));
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

  if (result === 'success') {
    return (
      <Layout title="Przywracanie hasła" variant="narrow">
        <p className="text-lg">
          Link do resetowania hasła został wysłany na adres: <span className="font-bold text-primary">{email}</span>
          <ButtonLink to="/login" className="mt-8 w-full">
            Wróć do logowania
          </ButtonLink>
        </p>
      </Layout>
    );
  }

  return (
    <Layout title="Przywracanie hasła" variant="narrow">
      <form noValidate className="px-4" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <form.AppField name="email">
            {(field) => <field.FloatingTextField type="email" label="E-mail" />}
          </form.AppField>
        </div>

        <div className="mt-8">
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" className="w-full" loading={isSubmitting}>
                Przypomnij hasło
              </Button>
            )}
          </form.Subscribe>
        </div>

        <div className="!mt-8 flex flex-wrap items-center justify-end">
          <Link to="/login">Powrót do logowania</Link>
        </div>
      </form>
    </Layout>
  );
}
