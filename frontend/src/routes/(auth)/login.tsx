import { createFileRoute, useRouter } from '@tanstack/react-router';
import { z } from 'zod';
import { allowOnly } from '@/lib/guards';
import { useForm } from '@tanstack/react-form';
import React from 'react';
import { AppButton } from '@/components/shared/AppButton';
import { AppLayout } from '@/components/shared/AppLayout';
import { AppLink } from '@/components/shared/AppLink';
import { AppFloatingLabelInput } from '@/components/shared/inputs/AppFloatingLabelInput';
import { trackFormSubmit } from '@/lib/sentry';
import { getErrors } from '@/lib/form-errors';
import { useUserContext } from '@/providers/useUserContext';
import { SignInResult } from '@/types/user';

export const Route = createFileRoute('/(auth)/login')({
  component: LoginPage,
  beforeLoad: allowOnly.unauthenticated(),
  validateSearch: z.object({ redirect: z.string().optional() }),
});

const validationSchema = z.object({
  email: z.email('Nieprawidłowy adres email').or(z.literal('')),
  password: z.string().nonempty('Hasło nie może być puste').or(z.literal('')),
});

const errorMessages = {
  success: '',
  error: 'Wystąpił błąd podczas logowania. Sprawdź połączenie z internetem.',
  invalid_credentials: 'Podano błędne hasło lub użytkownik nie istnieje.',
};

function LoginPage() {
  const userContext = useUserContext();
  const router = useRouter();
  const { redirect } = Route.useSearch();
  const [signInResult, setSignInResult] = React.useState<SignInResult | undefined>(undefined);

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onChange: validationSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      trackFormSubmit('login', 'valid', formApi.state);

      if (!value.email || !value.password) {
        throw new Error('Not all fields are filled despite validation');
      }

      setSignInResult(undefined);
      const result = await userContext?.signIn(value.email, value.password);
      await router.invalidate();

      if (result !== 'success') {
        setSignInResult(result);
        return;
      }

      // Delay redirection so that the user context has time to update
      setTimeout(() => {
        router.navigate({ to: redirect ?? '/' });
      }, 50);
    },
    onSubmitInvalid: ({ formApi }) => {
      trackFormSubmit('login', 'invalid', formApi.state);
    },
  });

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  }

  return (
    <AppLayout title="Logowanie" variant="narrow" disableBackButton data-testid="login-page-title">
      <form onSubmit={handleSubmit} className="px-4">
        <div className="space-y-4">
          <form.Field
            name="email"
            children={(field) => (
              <AppFloatingLabelInput
                name={field.name}
                value={field.state.value}
                type="email"
                onChange={field.handleChange}
                errors={getErrors(field.state.meta)}
                label="E-mail"
                data-testid="login-email-input"
              />
            )}
          />

          <form.Field
            name="password"
            children={(field) => (
              <AppFloatingLabelInput
                name={field.name}
                value={field.state.value}
                type="password"
                onChange={field.handleChange}
                errors={getErrors(field.state.meta)}
                label="Hasło"
                data-testid="login-password-input"
              />
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
