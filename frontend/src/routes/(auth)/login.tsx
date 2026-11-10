import { useAppForm } from '@/integrations/tanstack/form/hook';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { z } from 'zod';
import { loginValidationSchema } from '@/validation/auth';
import { allowOnly, safeRedirect } from '@/lib/guards';
import { formValidationLogic } from '@/integrations/tanstack/form/validation';
import React from 'react';
import { Button } from '@/components/shared/Button';
import { Alert } from '@/components/shared/Alert';
import { Link } from '@/components/shared/Link';
import { trackFormSubmit } from '@/integrations/sentry/client';
import { navigateToFirstError } from '@/integrations/tanstack/form/errors';
import { useSignIn } from '@/integrations/tanstack/query/auth';
import { AuthCard } from '@/features/auth/components/AuthCard';

export const Route = createFileRoute('/(auth)/login')({
  component: LoginPage,
  beforeLoad: allowOnly.unauthenticated(),
  validateSearch: z.object({ redirect: z.string().optional() }),
});

function LoginPage() {
  const signIn = useSignIn();
  const router = useRouter();
  const { redirect } = Route.useSearch();
  const [signInError, setSignInError] = React.useState<string | undefined>(undefined);

  const form = useAppForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validationLogic: formValidationLogic,
    validators: {
      onDynamic: loginValidationSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      trackFormSubmit('login', 'valid', formApi.state);

      setSignInError(undefined);
      const result = await signIn(value.email, value.password);

      if (result !== 'success') {
        setSignInError(result.error);
        return;
      }

      await router.invalidate();
      await router.navigate({ href: safeRedirect(redirect) ?? '/' });
    },
    onSubmitInvalid: ({ formApi }) => {
      trackFormSubmit('login', 'invalid', formApi.state);
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
      title="Logowanie"
      footer={
        <>
          Brak konta? <Link to="/register">Zarejestruj się</Link>
        </>
      }
    >
      <form noValidate onSubmit={handleSubmit} className="space-y-4">
        <form.AppField name="email">{(field) => <field.TextField type="email" label="E-mail" />}</form.AppField>

        <form.AppField name="password">{(field) => <field.TextField type="password" label="Hasło" />}</form.AppField>

        <div className="text-right text-sm">
          <Link to="/forgot-password">Zapomniałeś hasła?</Link>
        </div>

        {signInError && <Alert variant="danger">{signInError}</Alert>}

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" className="w-full" loading={isSubmitting}>
              Zaloguj
            </Button>
          )}
        </form.Subscribe>
      </form>
    </AuthCard>
  );
}
