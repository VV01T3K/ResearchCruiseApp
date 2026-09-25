import { useAppForm } from '@/integrations/tanstack/form/hook';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { z } from 'zod';
import { loginValidationSchema } from '@/validation/auth';
import { allowOnly } from '@/lib/guards';
import { formValidationLogic } from '@/integrations/tanstack/form/validation';
import React from 'react';
import { AppButton } from '@/components/shared/AppButton';
import { AppLayout } from '@/components/shared/AppLayout';
import { AppLink } from '@/components/shared/AppLink';
import { trackFormSubmit } from '@/integrations/sentry/client';
import { useSignIn } from '@/integrations/tanstack/query/auth';
import { SignInResult } from '@/integrations/auth/types';

export const Route = createFileRoute('/(auth)/login')({
  component: LoginPage,
  beforeLoad: allowOnly.unauthenticated(),
  validateSearch: z.object({ redirect: z.string().optional() }),
});

const errorMessages = {
  success: '',
  error: 'Wystąpił błąd podczas logowania. Sprawdź połączenie z internetem.',
  invalid_credentials: 'Podano błędne hasło lub użytkownik nie istnieje.',
};

function LoginPage() {
  const signIn = useSignIn();
  const router = useRouter();
  const { redirect } = Route.useSearch();
  const [signInResult, setSignInResult] = React.useState<SignInResult | undefined>(undefined);

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

      setSignInResult(undefined);
      const result = await signIn(loginValidationSchema.parse(value).email, value.password);

      if (result !== 'success') {
        setSignInResult(result);
        throw new Error(errorMessages[result]);
      }

      await router.invalidate();
      await router.navigate({ to: redirect ?? '/' });
    },
    onSubmitInvalid: ({ formApi }) => {
      trackFormSubmit('login', 'invalid', formApi.state);
    },
  });

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    void form.handleSubmit().catch(() => {});
  }

  return (
    <AppLayout title="Logowanie" variant="narrow" disableBackButton data-testid="login-page-title">
      <form onSubmit={handleSubmit} className="px-4">
        <div className="space-y-4">
          <form.AppField
            name="email"
            children={(field) => (
              <field.FloatingTextField type="email" label="E-mail" data-testid="login-email-input" />
            )}
          />

          <form.AppField
            name="password"
            children={(field) => (
              <field.FloatingTextField type="password" label="Hasło" data-testid="login-password-input" />
            )}
          />

          <div className="!mt-8 flex flex-wrap items-center justify-end">
            <AppLink href="/forgot-password">Zapomniałeś hasła?</AppLink>
          </div>

          <div className="mt-8">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <AppButton
                  type="submit"
                  className="w-full"
                  disabled={!canSubmit || isSubmitting}
                  data-testid="login-submit-btn"
                >
                  Zaloguj
                </AppButton>
              )}
            />

            {signInResult && (
              <p className="mt-2 text-center text-sm font-semibold text-danger">{errorMessages[signInResult]}</p>
            )}
          </div>

          <p className="!mt-8">
            Brak konta? <AppLink href="/register">Zarejestruj się</AppLink>
          </p>
        </div>
      </form>
    </AppLayout>
  );
}
