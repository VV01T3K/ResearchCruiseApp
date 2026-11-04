import { getProblemDetail } from '@/api/errors';
import type { RegisterAccountRequest } from '@/api/generated/schemas';
import { useAppForm } from '@/integrations/tanstack/form/hook';
import { createFileRoute } from '@tanstack/react-router';
import { allowOnly } from '@/lib/guards';
import { formValidationLogic } from '@/integrations/tanstack/form/validation';
import React from 'react';
import { z } from 'zod';
import { Button } from '@/components/shared/Button';
import { Layout } from '@/components/shared/Layout';
import { Link } from '@/components/shared/Link';
import { trackFormSubmit } from '@/integrations/sentry/client';
import { navigateToFirstError } from '@/integrations/tanstack/form/errors';
import { useRegisterAccount } from '@/api/generated/endpoints/auth.gen';

export const Route = createFileRoute('/(auth)/register')({
  component: RegisterPage,
  beforeLoad: allowOnly.unauthenticated(),
});

const validationSchema = z.object({
  email: z.email('Niepoprawny adres e-mail'),
  firstName: z.string().min(2, 'Imię powinno zawierać co najmniej 2 znaki'),
  lastName: z.string().min(2, 'Nazwisko powinno zawierać co najmniej 2 znaki'),
});

function RegisterPage() {
  const [submitError, setSubmitError] = React.useState<string>();
  const [registeredEmail, setRegisteredEmail] = React.useState<string>();
  const { mutateAsync } = useRegisterAccount({ mutation: { meta: { handlesError: true } } });
  const form = useAppForm({
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
    },
    validationLogic: formValidationLogic,
    validators: {
      onDynamic: validationSchema,
    },
    onSubmit: async ({ value }) => {
      trackFormSubmit('register', 'valid', form.state);

      setSubmitError(undefined);
      try {
        await mutateAsync({ data: value satisfies RegisterAccountRequest });
      } catch (error) {
        setSubmitError(getProblemDetail(error, 'Rejestracja nie powiodła się. Spróbuj ponownie.'));
        return;
      }
      setRegisteredEmail(value.email);
    },
    onSubmitInvalid: ({ formApi }) => {
      trackFormSubmit('register', 'invalid', formApi.state);
      navigateToFirstError();
    },
  });

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    void form.handleSubmit();
  }

  if (registeredEmail) {
    return (
      <Layout title="Sprawdź swoją pocztę" variant="narrow">
        <div className="space-y-4 text-lg">
          <p>
            Wysłaliśmy wiadomość na adres: <span className="font-bold text-primary">{registeredEmail}</span>
          </p>
          <p>Kliknij link z tej wiadomości i ustaw hasło, aby dokończyć rejestrację.</p>
          <p>Potem Biuro Armatora musi zaakceptować Twoje konto. Dostaniesz wtedy wiadomość e-mail.</p>
        </div>
        <Button type="link" href="/login" className="mt-8 w-full">
          Wróć do logowania
        </Button>
      </Layout>
    );
  }

  return (
    <Layout title="Rejestracja" variant="narrow">
      <form noValidate className="px-4" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <form.AppField name="email">
            {(field) => <field.FloatingTextField type="email" label="E-mail" />}
          </form.AppField>

          <form.AppField name="firstName">
            {(field) => <field.FloatingTextField type="text" label="Imię" />}
          </form.AppField>

          <form.AppField name="lastName">
            {(field) => <field.FloatingTextField type="text" label="Nazwisko" />}
          </form.AppField>

          <div className="!mt-12">
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  Zarejestruj się
                </Button>
              )}
            </form.Subscribe>

            {submitError && <p className="mt-2 text-center text-sm font-semibold text-danger">{submitError}</p>}
          </div>

          <p className="!mt-8">
            Masz już konto? <Link href="/login">Zaloguj się</Link>
          </p>
        </div>
      </form>
    </Layout>
  );
}
