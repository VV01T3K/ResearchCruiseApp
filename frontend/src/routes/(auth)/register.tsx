import { getProblemDetail } from '@/api/errors';
import type { RegisterAccountRequest } from '@/api/generated/schemas';
import { useAppForm } from '@/integrations/tanstack/form/hook';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { allowOnly } from '@/lib/guards';
import { formValidationLogic } from '@/integrations/tanstack/form/validation';
import React from 'react';
import { z } from 'zod';
import { AppButton } from '@/components/shared/AppButton';
import { AppLayout } from '@/components/shared/AppLayout';
import { AppLink } from '@/components/shared/AppLink';
import { trackFormSubmit } from '@/integrations/sentry/client';
import { useRegisterAccount } from '@/api/generated/endpoints/auth.gen';

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
    },
  });

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    void form.handleSubmit();
  }

  return (
    <AppLayout title="Rejestracja" variant="narrow">
      <form className="px-4" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <form.AppField name="email" children={(field) => <field.FloatingTextField type="email" label="E-mail" />} />

          <form.AppField name="firstName" children={(field) => <field.FloatingTextField type="text" label="Imię" />} />

          <form.AppField
            name="lastName"
            children={(field) => <field.FloatingTextField type="text" label="Nazwisko" />}
          />

          <form.AppField
            name="password"
            children={(field) => <field.FloatingTextField type="password" label="Hasło" />}
          />

          <form.AppField
            name="confirmPassword"
            children={(field) => <field.FloatingTextField type="password" label="Potwierdź hasło" />}
          />

          <div className="!mt-12">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <AppButton type="submit" className="w-full" disabled={!canSubmit || isSubmitting}>
                  Zarejestruj się
                </AppButton>
              )}
            />

            {submitError && <p className="mt-2 text-center text-sm font-semibold text-danger">{submitError}</p>}
          </div>

          <p className="!mt-8">
            Masz już konto? <AppLink href="/login">Zaloguj się</AppLink>
          </p>
        </div>
      </form>
    </AppLayout>
  );
}
