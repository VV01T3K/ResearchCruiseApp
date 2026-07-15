import { createFileRoute } from '@tanstack/react-router';
import { allowOnly } from '@/lib/guards';
import { revalidateLogic, useForm } from '@tanstack/react-form';
import React from 'react';
import { z } from 'zod';
import { AppButton } from '@/components/shared/AppButton';
import { AppLayout } from '@/components/shared/AppLayout';
import { AppLink } from '@/components/shared/AppLink';
import { AppFloatingLabelInput } from '@/components/shared/inputs/AppFloatingLabelInput';
import { trackFormSubmit } from '@/integrations/sentry/client';
import { getErrors } from '@/integrations/tanstack/form/errors';
import { useRequestPasswordReset } from '@/api/generated/endpoints/auth.gen';
import { Result } from '@/api/user';

export const Route = createFileRoute('/(auth)/forgot-password')({
  component: ForgotPasswordPage,
  beforeLoad: allowOnly.unauthenticated(),
});

const validationSchema = z.object({
  email: z.email('Niepoprawny adres e-mail'),
});

function ForgotPasswordPage() {
  const [result, setResult] = React.useState<Result | undefined>(undefined);
  const [email, setEmail] = React.useState<string | undefined>(undefined);
  const { mutateAsync } = useRequestPasswordReset({
    mutation: {
      onSuccess: () => setResult('success'),
      onError: () => setResult('error'),
    },
  });
  const form = useForm({
    defaultValues: {
      email: '',
    },
    validationLogic: revalidateLogic({ mode: 'change', modeAfterSubmission: 'change' }),
    validators: {
      onDynamic: validationSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      trackFormSubmit('forgot-password', 'valid', formApi.state);

      setResult(undefined);
      await mutateAsync(
        { data: { email: value.email } },
        {
          onSuccess: async () => {
            setEmail(value.email);
          },
        }
      ).catch(() => {});
    },
    onSubmitInvalid: ({ formApi }) => {
      trackFormSubmit('forgot-password', 'invalid', formApi.state);
    },
  });

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  }

  if (result === 'success') {
    return (
      <AppLayout title="Przywracanie hasła" variant="narrow">
        <p className="text-lg">
          Link do resetowania hasła został wysłany na adres: <span className="font-bold text-primary">{email}</span>
          <AppButton type="link" href="/login" className="mt-8 w-full">
            Wróć do logowania
          </AppButton>
        </p>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Przywracanie hasła" variant="narrow">
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
                errors={getErrors(field.state.meta, form.state.submissionAttempts)}
                label="E-mail"
              />
            )}
          />
        </div>

        <div className="mt-8">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <AppButton type="submit" className="w-full" disabled={!canSubmit || isSubmitting}>
                Przypomnij hasło
              </AppButton>
            )}
          />
        </div>

        <div className="!mt-8 flex flex-wrap items-center justify-end">
          <AppLink href="/login">Powrót do logowania</AppLink>
        </div>
      </form>
    </AppLayout>
  );
}
