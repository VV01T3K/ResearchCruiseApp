import { getErrorMessage } from '@/api/errors';
import { toast } from '@/components/shared/layout/toast';
import { RequestPasswordResetRequest } from '@/api/generated/schemas';
import { formContract } from '@/integrations/tanstack/form/schema';
import { useAppForm } from '@/integrations/tanstack/form/hook';
import { createFileRoute } from '@tanstack/react-router';
import { allowOnly } from '@/lib/guards';
import { formValidationLogic } from '@/integrations/tanstack/form/validation';
import React from 'react';
import { z } from 'zod';
import { AppButton } from '@/components/shared/AppButton';
import { AppLayout } from '@/components/shared/AppLayout';
import { AppLink } from '@/components/shared/AppLink';
import { trackFormSubmit } from '@/integrations/sentry/client';
import { useRequestPasswordReset } from '@/api/generated/endpoints/auth.gen';
import { Result } from '@/integrations/auth/types';

export const Route = createFileRoute('/(auth)/forgot-password')({
  component: ForgotPasswordPage,
  beforeLoad: allowOnly.unauthenticated(),
});

const validationSchema = z
  .object({
    email: z.email('Niepoprawny adres e-mail'),
  })
  .pipe(formContract(RequestPasswordResetRequest));

function ForgotPasswordPage() {
  const [result, setResult] = React.useState<Result | undefined>(undefined);
  const [email, setEmail] = React.useState<string | undefined>(undefined);
  const { mutateAsync } = useRequestPasswordReset({
    mutation: {
      onSuccess: () => setResult('success'),
      onError: (error) => {
        setResult('error');
        toast.error(getErrorMessage(error, 'Operacja nie powiod\u0142a si\u0119'));
      },
    },
  });
  const form = useAppForm({
    defaultValues: {
      email: '',
    },
    validationLogic: formValidationLogic,
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
      );
    },
    onSubmitInvalid: ({ formApi }) => {
      trackFormSubmit('forgot-password', 'invalid', formApi.state);
    },
  });

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    void form.handleSubmit().catch(() => {});
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
          <form.AppField name="email" children={(field) => <field.FloatingTextField type="email" label="E-mail" />} />
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
