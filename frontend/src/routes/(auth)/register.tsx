import { getErrorMessage } from '@/api/errors';
import { toast } from '@/components/shared/layout/toast';
import { RegisterAccountRequest } from '@/api/generated/schemas';
import { formContract } from '@/integrations/tanstack/form/schema';
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
import { getProblemDetail } from '@/api/fetch';
import { Result } from '@/integrations/auth/types';

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
  })
  .transform((value): z.input<typeof RegisterAccountRequest> => value)
  .pipe(formContract(RegisterAccountRequest));

const errorMessages: Record<Result | 'username-taken', string> = {
  success: '',
  'username-taken': 'Podany adres e-mail jest już zajęty.',
  error: 'Wystąpił błąd podczas rejestracji. Sprawdź połączenie z internetem.',
};

function RegisterPage() {
  const navigate = useNavigate();
  const [result, setResult] = React.useState<(Result | 'username-taken') | undefined>(undefined);
  const { mutateAsync } = useRegisterAccount({
    mutation: {
      onSuccess: () => setResult('success'),
      onError: (error) => {
        setResult(getProblemDetail(error, '').includes('taken') ? 'username-taken' : 'error');
        toast.error(getErrorMessage(error, 'Rejestracja nie powiod\u0142a si\u0119'));
      },
    },
  });
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

      await mutateAsync(
        { data: validationSchema.parse(value) },
        {
          onSuccess: async () => {
            await navigate({ to: '/login' });
          },
        }
      );
    },
    onSubmitInvalid: ({ formApi }) => {
      trackFormSubmit('register', 'invalid', formApi.state);
    },
  });

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    void form.handleSubmit().catch(() => {});
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

            {result && <p className="mt-2 text-center text-sm font-semibold text-danger">{errorMessages[result]}</p>}
          </div>

          <p className="!mt-8">
            Masz już konto? <AppLink href="/login">Zaloguj się</AppLink>
          </p>
        </div>
      </form>
    </AppLayout>
  );
}
