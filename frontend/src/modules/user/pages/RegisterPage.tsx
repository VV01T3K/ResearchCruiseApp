import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import React from 'react';
import { z } from 'zod';

import { AppButton } from '@/core/components/AppButton';
import { AppLayout } from '@/core/components/AppLayout';
import { AppLink } from '@/core/components/AppLink';
import { AppFloatingLabelInput } from '@/core/components/inputs/AppFloatingLabelInput';
import { getErrors } from '@/core/lib/utils';
import { useRegisterMutation } from '@/user/hooks/UserApiHooks';
import { Result } from '@/user/models/Results';

const validationSchema = z
  .object({
    email: z.string().email('Niepoprawny adres e-mail'),
    firstname: z.string().min(2),
    lastname: z.string().min(2),
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

const errorMessages: Record<Result | 'username-taken', string> = {
  success: '',
  'username-taken': 'Podany adres e-mail jest już zajęty.',
  error: 'Wystąpił błąd podczas rejestracji. Sprawdź połączenie z internetem.',
};

export function RegisterPage() {
  const navigate = useNavigate();
  const [result, setResult] = React.useState<(Result | 'username-taken') | undefined>(undefined);
  const { mutateAsync } = useRegisterMutation({ setResult });
  const form = useForm({
    defaultValues: {
      email: '',
      firstname: '',
      lastname: '',
      password: '',
      confirmPassword: '',
    },
    validators: {
      onChange: validationSchema,
    },
    onSubmit: async ({ value }) => {
      if (!value.email || !value.firstname || !value.lastname || !value.password) {
        throw new Error('Not all fields are filled despite validation');
      }

      await mutateAsync(value, {
        onSuccess: async () => {
          await navigate({ to: '/login' });
        },
      }).catch(() => {});
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  }

  return (
    <AppLayout title="Rejestracja" variant="narrow">
      <form className="px-4" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <form.Field
            name="email"
            children={(field) => (
              <AppFloatingLabelInput
                name={field.name}
                value={field.state.value}
                type="email"
                onBlur={field.handleBlur}
                onChange={field.handleChange}
                errors={getErrors(field.state.meta)}
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
                onChange={field.handleChange}
                errors={getErrors(field.state.meta)}
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
                onChange={field.handleChange}
                errors={getErrors(field.state.meta)}
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
                onChange={field.handleChange}
                errors={getErrors(field.state.meta)}
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
                onChange={field.handleChange}
                errors={getErrors(field.state.meta)}
                label="Potwierdź hasło"
                required
              />
            )}
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

            {result && <p className="mt-2 text-danger text-sm text-center font-semibold">{errorMessages[result]}</p>}
          </div>

          <p className="!mt-8">
            Masz już konto? <AppLink href="/login">Zaloguj się</AppLink>
          </p>
        </div>
      </form>
    </AppLayout>
  );
}
