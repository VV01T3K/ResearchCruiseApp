import { useAppForm } from '@/integrations/tanstack/form/hook';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { z } from 'zod';
import { loginValidationSchema } from '@/validation/auth';
import { allowOnly, safeRedirect } from '@/lib/guards';
import { formValidationLogic } from '@/integrations/tanstack/form/validation';
import React from 'react';
import { Button } from '@/components/shared/Button';
import { Layout } from '@/components/shared/Layout';
import { Link } from '@/components/shared/Link';
import { trackFormSubmit } from '@/integrations/sentry/client';
import { navigateToFirstError } from '@/integrations/tanstack/form/errors';
import { useSignIn } from '@/integrations/tanstack/query/auth';

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
    <Layout title="Logowanie" variant="narrow" disableBackButton>
      <form noValidate onSubmit={handleSubmit} className="px-4">
        <div className="space-y-4">
          <form.AppField name="email">
            {(field) => <field.FloatingTextField type="email" label="E-mail" />}
          </form.AppField>

          <form.AppField name="password">
            {(field) => <field.FloatingTextField type="password" label="Hasło" />}
          </form.AppField>

          <div className="!mt-8 flex flex-wrap items-center justify-end">
            <Link to="/forgot-password">Zapomniałeś hasła?</Link>
          </div>

          <div className="mt-8">
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <Button type="submit" className="w-full" loading={isSubmitting}>
                  Zaloguj
                </Button>
              )}
            </form.Subscribe>

            {signInError && <p className="mt-2 text-center text-sm font-semibold text-danger">{signInError}</p>}
          </div>

          <p className="!mt-8">
            Brak konta? <Link to="/register">Zarejestruj się</Link>
          </p>
        </div>
      </form>
    </Layout>
  );
}
