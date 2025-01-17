import { client } from '@core/api';
import { AppButton } from '@core/components/AppButton';
import { AppFloatingLabelInput } from '@core/components/AppFloatingLabelInput';
import { AppLink } from '@core/components/AppLink';
import { guardAgainstAuthenticated } from '@core/guards';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import { z } from 'zod';

export const Route = createFileRoute('/register')({
  component: Register,
  beforeLoad: guardAgainstAuthenticated,
});

const registerSchema = z
  .object({
    email: z.string().email('Niepoprawny adres e-mail'),
    firstname: z.string().min(2),
    lastname: z.string().min(2),
    password: z
      .string()
      .min(8, 'Hasło powinno mieć conajmniej 8 znaków')
      .regex(
        /\b(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}\b/,
        'Co najmniej 8 znaków w tym przynajmniej jedna duża litera, mała litera oraz cyfra'
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

type RegistrationResult = 'success' | 'username-taken' | 'error';

const registerErrorMessages: Record<RegistrationResult, string> = {
  success: '',
  'username-taken': 'Podany adres e-mail jest już zajęty.',
  error: 'Wystąpił błąd podczas rejestracji. Sprawdź połączenie z internetem.',
};

function Register() {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: async (data: {
      email: string;
      firstname: string;
      lastname: string;
      password: string;
    }) => {
      return await client.post('/account/register', data);
    },
    onSuccess: async () => {
      setRegistrationResult('success');
    },
    onError: async (error) => {
      if (isAxiosError(error)) {
        if (error.response?.data.includes('taken')) {
          setRegistrationResult('username-taken');
          return;
        }
      }
      setRegistrationResult('error');
    },
  });
  const [registrationResult, setRegistrationResult] = useState<
    RegistrationResult | undefined
  >(undefined);

  const form = useForm({
    defaultValues: {
      email: '',
      firstname: '',
      lastname: '',
      password: '',
      confirmPassword: '',
    },
    validators: {
      onChange: registerSchema,
    },
    onSubmit: async ({ value }) => {
      if (
        !value.email ||
        !value.firstname ||
        !value.lastname ||
        !value.password
      ) {
        throw new Error('Not all fields are filled despite validation');
      }

      await mutation
        .mutateAsync(value, {
          onSuccess: async () => {
            await navigate({ to: '/login' });
          },
        })
        .catch(() => {});
    },
  });

  return (
    <div className="p-4 w-full min-h-screen backdrop-blur-md relative">
      <form
        className="max-w-2xl mx-auto p-16 bg-gray-50 rounded-xl mt-[25vh]"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <h1 className="text-3xl font-bold mb-12">Rejestracja</h1>

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
            name="firstname"
            children={(field) => (
              <AppFloatingLabelInput
                name={field.name}
                value={field.state.value}
                type="text"
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                label="Imię"
                required
              />
            )}
          />

          <form.Field
            name="lastname"
            children={(field) => (
              <AppFloatingLabelInput
                name={field.name}
                value={field.state.value}
                type="text"
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                label="Nazwisko"
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
                error={field.state.meta.errors.join(', ')}
                label="Hasło"
                required
              />
            )}
          />

          <form.Field
            name="confirmPassword"
            children={(field) => (
              <AppFloatingLabelInput
                name={field.name}
                value={field.state.value}
                type="password"
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                error={field.state.meta.errors.join(', ')}
                label="Potwierdź hasło"
                required
              />
            )}
          />

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
                  Zarejestruj się
                </AppButton>
              )}
            />

            {registrationResult ? (
              <p className="mt-2 text-red-500 text-sm text-center font-semibold">
                {registerErrorMessages[registrationResult]}
              </p>
            ) : null}
          </div>

          <p className="!mt-8">
            Masz już konto? <AppLink to="/login">Zaloguj się</AppLink>
          </p>
        </div>
      </form>
    </div>
  );
}
