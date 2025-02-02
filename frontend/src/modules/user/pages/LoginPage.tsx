import { useForm } from '@tanstack/react-form';
import { getRouteApi, useRouter } from '@tanstack/react-router';
import React from 'react';
import { z } from 'zod';

import { AppButton } from '@/core/components/AppButton';
import { AppLayout } from '@/core/components/AppLayout';
import { AppLink } from '@/core/components/AppLink';
import { AppFloatingLabelInput } from '@/core/components/inputs/AppFloatingLabelInput';
import { mapValidationErrors } from '@/core/lib/utils';
import { useUserContext } from '@/user/hooks/UserContextHook';
import { SignInResult } from '@/user/models/Results';

const validationSchema = z.object({
  email: z.string().email('Nieprawidłowy adres email').or(z.literal('')),
  password: z.string().nonempty('Hasło nie może być puste').or(z.literal('')),
});

const errorMessages = {
  success: '',
  error: 'Wystąpił błąd podczas logowania. Sprawdź połączenie z internetem.',
  invalid_credentials: 'Podano błędne hasło lub użytkownik nie istnieje.',
};

export function LoginPage() {
  const userContext = useUserContext();
  const router = useRouter();
  const { redirect } = getRouteApi('/login').useSearch();
  const [signInResult, setSignInResult] = React.useState<SignInResult | undefined>(undefined);

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onChange: validationSchema,
    },
    onSubmit: async ({ value }) => {
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

      if (redirect) {
        await router.navigate({ to: redirect });
      } else {
        await router.navigate({ to: '/' });
      }
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  }

  return (
    <AppLayout title="Logowanie" variant="narrow">
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
                errors={mapValidationErrors(field.state.meta.errors)}
                label="E-mail"
                required
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
                errors={mapValidationErrors(field.state.meta.errors)}
                label="Hasło"
                required
              />
            )}
          />

          <div className="flex flex-wrap items-center justify-end !mt-8">
            <AppLink href="/forgotpassword">Zapomniałeś hasła?</AppLink>
          </div>

          <div className="mt-8">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <AppButton type="submit" className="w-full" disabled={!canSubmit || isSubmitting}>
                  Zaloguj
                </AppButton>
              )}
            />

            {signInResult && (
              <p className="mt-2 text-danger text-sm text-center font-semibold">{errorMessages[signInResult]}</p>
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
