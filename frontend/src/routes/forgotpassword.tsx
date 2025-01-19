import { client } from '@core/api';
import { AppButton } from '@core/components/AppButton';
import { AppFloatingLabelInput } from '@core/components/AppFloatingLabelInput';
import { AppLink } from '@core/components/AppLink';
import { AppPage } from '@core/components/AppPage';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { z } from 'zod';

export const Route = createFileRoute('/forgotpassword')({
  component: ForgotPassword,
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Niepoprawny adres e-mail').or(z.literal('')),
});

type ResetPasswordResult = 'success' | 'error';

function ForgotPassword() {
  const [resetPasswordStatus, setResetPasswordStatus] = useState<
    ResetPasswordResult | undefined
  >(undefined);
  const [email, setEmail] = useState<string | undefined>(undefined);
  const resetPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      return await client.post('/account/forgotPassword', { email });
    },
    onSuccess: () => {
      setResetPasswordStatus('success');
    },
    onError: () => {
      setResetPasswordStatus('error');
    },
  });
  const form = useForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onChange: forgotPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      if (!value.email) {
        throw new Error('Not all fields are filled despite validation');
      }

      setResetPasswordStatus(undefined);
      await resetPasswordMutation
        .mutateAsync(value.email, {
          onSuccess: async () => {
            setEmail(value.email);
          },
        })
        .catch(() => {});
    },
  });

  if (resetPasswordStatus === 'success') {
    return (
      <AppPage title="Przywracanie hasła" variant="narrow">
        <p className="text-lg">
          Link do resetowania hasła został wysłany na adres:{' '}
          <span className="font-bold text-blue-500">{email}</span>
          <AppButton link to="/login" variant="blue" className="w-full mt-8">
            Wróć do logowania
          </AppButton>
        </p>
      </AppPage>
    );
  }

  return (
    <AppPage title="Przywracanie hasła" variant="narrow">
      <form
        className="px-4"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
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
                Przypomnij hasło
              </AppButton>
            )}
          />
        </div>

        <div className="flex flex-wrap items-center justify-end !mt-8">
          <AppLink to="/login">Powrót do logowania</AppLink>
        </div>
      </form>
    </AppPage>
  );
}
