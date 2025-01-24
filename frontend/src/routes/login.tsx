import { SignInResult } from '@core/models';
import { UserContext } from '@core/contexts/UserContext';
import { useForm } from '@tanstack/react-form';
import {
  createFileRoute,
  useNavigate,
  useRouter,
} from '@tanstack/react-router';
import { useContext, useState } from 'react';
import { AppFloatingLabelInput } from '@core/components/AppFloatingLabelInput';
import { AppButton } from 'src/features/core/components/AppButton';
import { z } from 'zod';
import { AppLink } from '@core/components/AppLink';
import { AppPage } from '@core/components/AppPage';
import { allowOnly } from '@core/helpers';

export const Route = createFileRoute('/login')({
  component: Login,
  beforeLoad: allowOnly.unauthenticated(),
  validateSearch: z.object({ redirect: z.string().optional() }),
});

const loginSchema = z.object({
  email: z.string().email('Niepoprawny adres e-mail').or(z.literal('')),
  password: z.string().min(1).or(z.literal('')),
});

const loginErrorMessages: Record<SignInResult, string> = {
  success: '',
  error: 'Wystąpił błąd podczas logowania. Sprawdź połączenie z internetem.',
  invalid_credentials: 'Podano błędne hasło lub użytkownik nie istnieje.',
};

function Login() {
  const navigate = useNavigate();
  const router = useRouter();
  const { redirect } = Route.useSearch();
  const userContext = useContext(UserContext);
  const [signInResult, setSignInResult] = useState<SignInResult | undefined>(
    undefined
  );
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onChange: loginSchema,
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
        await navigate({ to: redirect });
      } else {
        await navigate({ to: '/' });
      }
    },
  });

  return (
    <AppPage title="Logowanie" variant="narrow">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="px-4"
      >
        <div className="space-y-4">
          <form.Field
            name="email"
            children={(field) => (
              <AppFloatingLabelInput
                name={field.name}
                value={field.state.value}
                type="email"
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                error={field.state.meta.errors.join(', ')}
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
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                label="Hasło"
                required
              />
            )}
          />

          <div className="flex flex-wrap items-center justify-end !mt-8">
            <AppLink to="/forgotpassword">Zapomniałeś hasła?</AppLink>
          </div>

          <div className="mt-8">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <AppButton
                  type="submit"
                  className="w-full"
                  variant="blue"
                  disabled={!canSubmit || isSubmitting}
                >
                  Zaloguj
                </AppButton>
              )}
            />

            {signInResult ? (
              <p className="mt-2 text-red-500 text-sm text-center font-semibold">
                {loginErrorMessages[signInResult]}
              </p>
            ) : null}
          </div>

          <p className="!mt-8">
            Brak konta? <AppLink to="/register">Zarejestruj się</AppLink>
          </p>
        </div>
      </form>
    </AppPage>
  );
}
