import { getProblemDetail } from '@/api/errors';
import type { RegisterAccountRequest } from '@/api/generated/schemas';
import { useAppForm } from '@/integrations/tanstack/form/hook';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { allowOnly } from '@/lib/guards';
import { formValidationLogic } from '@/integrations/tanstack/form/validation';
import React from 'react';
import { z } from 'zod';
import { Button } from '@/components/shared/Button';
import { Alert } from '@/components/shared/Alert';
import { Link } from '@/components/shared/Link';
import { trackFormSubmit } from '@/integrations/sentry/client';
import { navigateToFirstError } from '@/integrations/tanstack/form/errors';
import { useRegisterAccount } from '@/api/generated/endpoints/auth.gen';
import { AuthCard } from '@/features/auth/components/AuthCard';

export const Route = createFileRoute('/(auth)/register')({
  component: RegisterPage,
  beforeLoad: allowOnly.unauthenticated(),
});

const validationSchema = z
  .object({
    email: z.email('Niepoprawny adres e-mail'),
    firstName: z.string().min(2, 'Imię powinno zawierać co najmniej 2 znaki'),
    lastName: z.string().min(2, 'Nazwisko powinno zawierać co najmniej 2 znaki'),
    password: z
      .string()
      .min(8, 'Hasło powinno mieć co najmniej 8 znaków')
      .regex(
        /\b(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}\b/,
        'Hasło powinno zawierać jedną dużą literę, jedną małą literę oraz cyfrę'
      ),
    confirmPassword: z.string(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      return ctx.addIssue({
        code: 'custom',
        message: 'Hasła nie są takie same',
        path: ['confirmPassword'],
      });
    }
  });

function RegisterPage() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = React.useState<string>();
  const { mutateAsync } = useRegisterAccount({ mutation: { meta: { handlesError: true } } });
  const form = useAppForm({
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
    },
    validationLogic: formValidationLogic,
    validators: {
      onDynamic: validationSchema,
    },
    onSubmit: async ({ value }) => {
      trackFormSubmit('register', 'valid', form.state);

      setSubmitError(undefined);
      try {
        const { email, firstName, lastName, password } = value;
        await mutateAsync({ data: { email, firstName, lastName, password } satisfies RegisterAccountRequest });
      } catch (error) {
        setSubmitError(getProblemDetail(error, 'Rejestracja nie powiodła się. Spróbuj ponownie.'));
        return;
      }
      await navigate({ to: '/login' });
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

  return (
    <AuthCard
      title="Rejestracja"
      footer={
        <>
          Masz już konto? <Link to="/login">Zaloguj się</Link>
        </>
      }
    >
      <form noValidate className="space-y-4" onSubmit={handleSubmit}>
        <form.AppField name="email">{(field) => <field.TextField type="email" label="E-mail" />}</form.AppField>

        <div className="grid gap-4 sm:grid-cols-2">
          <form.AppField name="firstName">{(field) => <field.TextField type="text" label="Imię" />}</form.AppField>

          <form.AppField name="lastName">{(field) => <field.TextField type="text" label="Nazwisko" />}</form.AppField>
        </div>

        <form.AppField name="password">{(field) => <field.TextField type="password" label="Hasło" />}</form.AppField>

        <form.AppField name="confirmPassword">
          {(field) => <field.TextField type="password" label="Potwierdź hasło" />}
        </form.AppField>

        {submitError && <Alert variant="danger">{submitError}</Alert>}

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" className="w-full" loading={isSubmitting}>
              Zarejestruj się
            </Button>
          )}
        </form.Subscribe>
      </form>
    </AuthCard>
  );
}
